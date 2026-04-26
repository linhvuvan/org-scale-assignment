import { Navigate, Outlet } from "react-router-dom";
import { useLoggedIn } from "../hooks/useLocalStorage";

export function GuestRoute() {
  const { isLoggedIn } = useLoggedIn();

  if (isLoggedIn) return <Navigate to="/" replace />;

  return <Outlet />;
}
