import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("USER" | "ADMIN" | "COORDINATOR")[];
  requiredAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  requiredAuth = true,
}: ProtectedRouteProps) {
  // Get user data from localStorage
  const userStr = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  // Check if user is authenticated
  if (requiredAuth && !userStr) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has allowed role
  if (allowedRoles && role && !allowedRoles.includes(role as any)) {
    // Redirect based on current role
    if (role === "ADMIN" || role === "COORDINATOR") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
