import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPatients from "./pages/AdminPatients";
import AdminPatientDetail from "./pages/AdminPatientDetail";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Patient Portal */}
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions"
            element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            }
          />

          {/* Admin EMR */}
          <Route path="/admin" element={<AdminPatients />} />
          <Route path="/admin/patients/:id" element={<AdminPatientDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
