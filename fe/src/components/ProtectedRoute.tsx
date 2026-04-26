import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("logged_in") === "true";

  if (isLoggedIn) return <Outlet />;

  return <Navigate to="/login" replace />;
}
