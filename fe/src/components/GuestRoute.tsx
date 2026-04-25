import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
  return localStorage.getItem("logged_in") === "true"
    ? <Navigate to="/" replace />
    : <Outlet />;
}
