export function useAuth() {
  const userStr = localStorage.getItem("user");
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const user = userStr ? JSON.parse(userStr) : null;

  return {
    isAuthenticated: !!user && !!token,
    user,
    role,
    token,
    isAdmin: role === "ADMIN",
    isCoordinator: role === "COORDINATOR",
    isUser: role === "USER",
  };
}

export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  window.location.href = "/login";
}
