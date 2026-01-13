// src/services/apiClient.ts
import axios, { type AxiosInstance, AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

/**
 * Axios instance
 * Cookies (accessToken + refreshToken) automatically sent
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ⭐ REQUIRED for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * RESPONSE INTERCEPTOR
 * 1. Access token expired → 401
 * 2. Call /users/refresh-token (cookie-based)
 * 3. Backend sets new accessToken cookie
 * 4. Retry original request
 */
apiClient.interceptors.response.use(
  res => res,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;

    const code = error.response?.data?.code;

    // 🔥 ONLY refresh if token expired
    if (
  error.response?.status === 401 &&
  !originalRequest._retry
) {
  originalRequest._retry = true;

  try {
    await apiClient.post("/users/refresh-token");
    return apiClient(originalRequest);
  } catch {
    localStorage.clear();
    window.location.href = "/login?session=expired";
  }
}

    // ❗ other 401s → just reject (no redirect)
    return Promise.reject(error);
  }
);

export default apiClient;
