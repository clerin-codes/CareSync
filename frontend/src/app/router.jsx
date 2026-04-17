// import { createBrowserRouter } from "react-router-dom";
// import PublicLayout from "../layouts/PublicLayout";
// import DashboardLayout from "../layouts/DashboardLayout";

// import LandingPage from "../pages/public/LandingPage";
// import Login from "../features/auth/pages/Login";
// import Register from "../features/auth/pages/Register";
// import ForgotPassword from "../features/auth/pages/ForgotPassword";
// import ResetPassword from "../features/auth/pages/ResetPassword";

// import PatientDashboard from "../features/patient/pages/PatientDashboard";
// import MyProfile from "../features/patient/pages/MyProfile";
// import Documents from "../features/patient/pages/Documents";

// import AdminDashboard from "../features/admin/pages/AdminDashboard";
// import ManagePatients from "../features/admin/pages/ManagePatients";
// import ManageDoctors from "../features/admin/pages/ManageDoctors";

// import NotFound from "../pages/NotFound";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <PublicLayout />,
//     children: [
//       { index: true, element: <LandingPage /> },
//       { path: "login", element: <Login /> },
//       { path: "register", element: <Register /> },
//       { path: "forgot-password", element: <ForgotPassword /> },
//       { path: "reset-password", element: <ResetPassword /> },
//     ],
//   },
//   {
//     path: "/dashboard",
//     element: <DashboardLayout />,
//     children: [
//       { path: "patient", element: <PatientDashboard /> },
//       { path: "profile", element: <MyProfile /> },
//       { path: "documents", element: <Documents /> },

//       { path: "admin", element: <AdminDashboard /> },
//       { path: "admin/patients", element: <ManagePatients /> },
//       { path: "admin/doctors", element: <ManageDoctors /> },
//     ],
//   },
//   {
//     path: "*",
//     element: <NotFound />,
//   },
// ]);

// export default router;