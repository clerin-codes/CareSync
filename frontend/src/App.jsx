import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import LandingPage from "./pages/public/LandingPage";

import PatientDashboard from "./pages/patient/PatientDashboard";
import Profile from "./pages/patient/Profile";
import Documents from "./pages/patient/Documents";
import CreateProfile from "./pages/patient/CreateProfile";

// function LandingPage() {
//   return (
//     <section className="container-custom py-20">
//       <div className="card p-10 text-center">
//         <h1 className="mb-4 text-4xl font-bold text-slate-900">
//           Welcome to CareSync
//         </h1>
//         <p className="mx-auto max-w-2xl text-slate-600">
//           Smart patient care platform for profile and document management.
//         </p>
//       </div>
//     </section>
//   );
// }

function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected patient routes only */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/profile" element={<Profile />} />
          <Route path="/patient/documents" element={<Documents />} />
          <Route path="/patient/create-profile" element={<CreateProfile/>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}