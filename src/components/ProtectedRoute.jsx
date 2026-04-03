// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // 🔥 send user to login AND remember where they came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}