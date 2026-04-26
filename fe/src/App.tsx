import { SWRConfig } from "swr";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

export default function App() {
  return (
    <SWRConfig value={{ shouldRetryOnError: false }}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<GuestRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </SWRConfig>
  );
}
