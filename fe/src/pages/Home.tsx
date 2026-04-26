import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";

export function Home() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("logged_in");
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">Home</h1>
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
}
