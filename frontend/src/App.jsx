import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import GuestDashboard from "./pages/GuestDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import StaffDashboard from "./pages/StaffDashboard";

function ProtectedRoute({ children, roles }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (roles && !roles.includes(role)) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/guest"
        element={
          <ProtectedRoute roles={["GUEST"]}>
            <GuestDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute roles={["MANAGER"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reception"
        element={
          <ProtectedRoute roles={["RECEPTIONIST"]}>
            <ReceptionDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

