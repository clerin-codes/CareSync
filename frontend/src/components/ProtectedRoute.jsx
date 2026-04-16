import { Navigate } from "react-router-dom";

const roleHome = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
  responder: "/admin/dashboard/emergencies",
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={roleHome[role] || "/"} replace />;
  }

  return children;
}