import apiClient from "./apiClient";


export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}) => {
  const response = await apiClient.post("/users/register", data);
  return response.data;
};


export const loginService = async (email: string, password: string) => {
  const response = await apiClient.post("/users/login", {
    email,
    password,
  });
  return response.data;
};


// services/authService.ts
export const logout = () => {
  localStorage.removeItem("user");
};


export const getUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};


export const verifyEmail = async (token: string, email: string) => {
  const response = await apiClient.get(
    `/users/verifyEmail?token=${token}&email=${email}`
  );
  return response.data;
};


export const resendVerificationEmail = async (email: string) => {
  const response = await apiClient.post("/users/resendEmail", { email });
  return response.data;
};


export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/users/forgotPassword", { email });
  return response.data;
};


export const resetPassword = async (
  token: string,
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await apiClient.post("/users/resetPassword", {
    token,
    email,
    newPassword,
    confirmPassword,
  });
  return response.data;
};
