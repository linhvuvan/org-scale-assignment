import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  return localStorage.getItem("logged_in") === "true"
    ? <Outlet />
    : <Navigate to="/login" replace />;
}
