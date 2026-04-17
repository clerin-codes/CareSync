import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleGuard from "../components/RoleGuard";
import DashboardSidebar from "../components/DashboardSidebar";
import Home from "../pages/Home";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import RegisterPatient from "../pages/RegisterPatient";
import Doctors from "../pages/Doctors";
import DoctorDetails from "../pages/DoctorDetails";
import PatientDashboard from "../pages/patient/PatientDashboard";
import AiChat from "../pages/patient/AiChat";
import PatientMedicalHistory from "../pages/patient/PatientMedicalHistory";
import Profile from "../pages/patient/Profile";
import Directory from "../pages/patient/Directory";
import Document from "../pages/patient/Document";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointments from "../pages/patient/MyAppointments";
import PatientPayments from "../pages/patient/PatientPayments";
// import PatientProfile from "../pages/patient/PatientProfile";
// import PatientReports from "../pages/patient/PatientReports";
// import PatientPrescriptions from "../pages/patient/PatientPrescriptions";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import DoctorAvailability from "../pages/doctor/DoctorAvailability";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import IssuePrescription from "../pages/doctor/IssuePrescription";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateDoctorAccount from "../pages/admin/CreateDoctorAccount";
import CreateDoctorProfile from "../pages/admin/CreateDoctorProfile";
import ConsultationRoom from "../pages/ConsultationRoom";

function PublicLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <DashboardSidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <section className="section container centered-page">
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist.</p>
    </section>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<PublicLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register-patient" element={<RegisterPatient />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleGuard allowedRoles={["PATIENT"]} />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route
              path="/patient/doctors"
              element={<Doctors dashboardMode />}
            />
            <Route
              path="/patient/doctors/:id"
              element={<DoctorDetails dashboardMode />}
            />
            <Route
              path="/patient/book-appointment"
              element={<BookAppointment />}
            />
            <Route path="/patient/appointments" element={<MyAppointments />} />
            <Route path="/patient/payments" element={<PatientPayments />} />
            <Route path="/patient/profile" element={<Profile />} />
            <Route path="/patient/medical-history" element={<PatientMedicalHistory />} />
            <Route path="/patient/ai-chat" element={<AiChat />} />
            <Route path="/patient/directory" element={<Directory />} />
            <Route path="/patient/documents" element={<Document />} />
            {/* <Route path="/patient/reports" element={<PatientReports />} /> */}
            {/* <Route
              path="/patient/prescriptions"
              element={<PatientPrescriptions />}
            /> */}
          </Route>

          <Route element={<RoleGuard allowedRoles={["DOCTOR"]} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            <Route
              path="/doctor/availability"
              element={<DoctorAvailability />}
            />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointments />}
            />
            <Route
              path="/doctor/issue-prescription"
              element={<IssuePrescription />}
            />
          </Route>

          <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/create-doctor-account"
              element={<CreateDoctorAccount />}
            />
            <Route
              path="/admin/create-doctor-profile"
              element={<CreateDoctorProfile />}
            />
          </Route>

          <Route element={<RoleGuard allowedRoles={["PATIENT", "DOCTOR"]} />}>
            <Route
              path="/consultation/:appointmentId"
              element={<ConsultationRoom />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

