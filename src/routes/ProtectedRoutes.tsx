import { Navigate } from "react-router-dom";
import type { ComponentType } from "react";

interface ProtectedRouteProps {
  element: ComponentType;
  allowedRoles?: ("USER" | "ADMIN" | "COORDINATOR")[];
}

const ProtectedRoute = ({ 
  element: Component,
  allowedRoles = ["ADMIN", "COORDINATOR"] // Default: only admin and coordinator can access admin routes
}: ProtectedRouteProps) => {
  const userData = localStorage.getItem("user");
  const role = userData ? JSON.parse(userData).role : null;

  // Check if user is authenticated
  if (!userData && role === null) {
    return <Navigate to="/login" />;
  }

  // Check if user has allowed role
  if (!allowedRoles.includes(role as any)) {
    // Redirect based on their role
    if (role === "ADMIN" || role === "COORDINATOR") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return <Component />;
};

export default ProtectedRoute;
