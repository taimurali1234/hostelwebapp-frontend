import apiClient from "./apiClient";


export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}) => {
  const response = await apiClient.post("/api/users/register", data);
  return response.data;
};


export const loginService = async (email: string, password: string) => {
  const response = await apiClient.post("/api/users/login", {
    email,
    password,
  });
  return response.data;
};


export const logout = async () => {
  await apiClient.post("/api/users/logout");
};


export const getUserProfile = async () => {
  const response = await apiClient.get("/api/users/me");
  return response.data;
};


export const verifyEmail = async (token: string, email: string) => {
  const response = await apiClient.get(
    `/api/users/verifyEmail?token=${token}&email=${email}`
  );
  return response.data;
};


export const resendVerificationEmail = async (email: string) => {
  const response = await apiClient.post("/api/users/resendEmail", { email });
  return response.data;
};


export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/api/users/forgotPassword", { email });
  return response.data;
};


export const resetPassword = async (
  token: string,
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await apiClient.post("/api/users/resetPassword", {
    token,
    email,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
