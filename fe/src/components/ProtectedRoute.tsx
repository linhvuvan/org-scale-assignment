import { Navigate, Outlet } from "react-router-dom";
import { useLoggedIn } from "../hooks/useLocalStorage";

export function ProtectedRoute() {
  const { isLoggedIn } = useLoggedIn();

  if (isLoggedIn) return <Outlet />;

  return <Navigate to="/login" replace />;
}
