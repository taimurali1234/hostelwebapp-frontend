import { Navigate } from "react-router-dom";
import type { ComponentType } from "react";

interface PublicRouteProps {
  element: ComponentType;
}

const PublicRoute = ({ element: Component }: PublicRouteProps) => {
  const userData = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  // If user is already logged in, redirect to appropriate dashboard
  if (userData && role) {
    if (role === "ADMIN" || role === "COORDINATOR") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  // User is not logged in, allow access to public page
  return <Component />;
};

export default PublicRoute;
