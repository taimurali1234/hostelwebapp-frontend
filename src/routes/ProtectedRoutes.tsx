import { Navigate } from "react-router-dom";
import type { ComponentType } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  element: ComponentType;
  allowedRoles?: ("USER" | "ADMIN" | "COORDINATOR")[];
}

const ProtectedRoute = ({
  element: Component,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "ADMIN" || user.role === "COORDINATOR") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return <Component />;
};

export default ProtectedRoute;
