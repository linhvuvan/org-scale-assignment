import { Navigate, Outlet } from "react-router-dom";

export function GuestRoute() {
  const isLoggedIn = localStorage.getItem("logged_in") === "true";

  if (isLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
}
