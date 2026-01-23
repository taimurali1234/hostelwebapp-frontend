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
});

/**
 * RESPONSE INTERCEPTOR
 * 1. Access token expired → 401
 * 2. Call /users/refresh-token (cookie-based)
 * 3. Backend sets new accessToken cookie
 * 4. Retry original request
 */
apiClient.interceptors.response.use(
  res => {
    console.log("✅ Response OK:", res.config.url);
    return res;
  },
  async (error) => {
    console.log("🔥 Interceptor HIT:", error.config?.url, error.response?.status);
    
    const originalRequest = error.config as any;

    if (originalRequest?.url?.includes("/users/refresh-token")) {
      console.log("❌ Refresh token failed – logging out");
      localStorage.removeItem("user");
      window.location.href = "/login?session=expired";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("🔁 Trying refresh token...");
      originalRequest._retry = true;

      try {
        await apiClient.post("/users/refresh-token");
        console.log("✅ Refresh success – retrying original request");
        return apiClient(originalRequest);
      } catch {
        console.log("❌ Refresh failed – redirecting");
        localStorage.removeItem("user");
        window.location.href = "/login?session=expired";
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;
