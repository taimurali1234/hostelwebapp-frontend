import axios, { type AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_UR || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store for managing token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: AxiosError) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  isRefreshing = false;
  failedQueue = [];
};

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If the error is 401 (Unauthorized) and it's not the refresh endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/refresh-token')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token, logout user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          processQueue(error, null);
          window.location.href = '/login?session=expired';
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;

        // Store new access token
        localStorage.setItem('accessToken', accessToken);

        // Set authorization header for future requests
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        processQueue(refreshError as AxiosError, null);
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Register a new user
 */
export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}) => {
  try {
    const response = await apiClient.post('/users/register', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Login user
 */
export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/users/login', { email, password });
    const { data } = response.data;

    // Store tokens and user info
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }

    // Store user info (without tokens)
    const userInfo = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      address: data.address,
    };
    localStorage.setItem('user', JSON.stringify(userInfo));

    // Set authorization header
    if (data.accessToken) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
    }

    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await apiClient.post('/users/logout');
  } catch (error: any) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens and user info
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Clear authorization header
    delete apiClient.defaults.headers.common.Authorization;
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async () => {
  try {
    const refreshTokenValue = localStorage.getItem('refreshToken');
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/users/refresh-token', {
      refreshToken: refreshTokenValue,
    });

    const { accessToken } = response.data.data;

    // Store new access token
    localStorage.setItem('accessToken', accessToken);

    // Set authorization header
    apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    return response.data;
  } catch (error: any) {
    // Clear tokens on refresh failure
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error.response?.data || error;
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string, email: string) => {
  try {
    const response = await apiClient.get(`/users/verifyEmail?token=${token}&email=${email}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (email: string) => {
  try {
    const response = await apiClient.post('/users/resendEmail', { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post('/users/forgotPassword', { email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, email: string, newPassword: string, confirmPassword: string) => {
  try {
    const response = await apiClient.post('/users/resetPassword', {
      token,
      email,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.userId) {
      const response = await apiClient.get(`/users/${user.userId}`);
      return response.data;
    }
    return null;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

/**
 * Initialize auth service - set access token if available
 */
export const initializeAuth = () => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
};

export default apiClient;
