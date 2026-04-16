import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  UserCircle,
  Clock,
  Pill,
  Stethoscope,
  CalendarPlus,
  CreditCard,
  FileText,
  ClipboardList,
  UserPlus,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const linksByRole = {
  PATIENT: [
    { to: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/patient/doctors", label: "Find Doctors", icon: Stethoscope },
    {
      to: "/patient/book-appointment",
      label: "Book Appointment",
      icon: CalendarPlus,
    },
    {
      to: "/patient/appointments",
      label: "My Appointments",
      icon: CalendarClock,
    },
    { to: "/patient/payments", label: "Payments", icon: CreditCard },
    { to: "/patient/profile", label: "My Profile", icon: UserCircle },
    { to: "/patient/reports", label: "My Reports", icon: FileText },
    { to: "/patient/prescriptions", label: "Prescriptions", icon: Pill },
  ],
  DOCTOR: [
    { to: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/doctor/appointments", label: "Appointments", icon: CalendarClock },
    { to: "/doctor/profile", label: "My Profile", icon: UserCircle },
    { to: "/doctor/availability", label: "Availability", icon: Clock },
    { to: "/doctor/issue-prescription", label: "Prescription", icon: Pill },
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    {
      to: "/admin/create-doctor-account",
      label: "Create Doctor Account",
      icon: UserPlus,
    },
    {
      to: "/admin/create-doctor-profile",
      label: "Create Doctor Profile",
      icon: ClipboardList,
    },
  ],
};

const roleHintByRole = {
  PATIENT: "Track appointments, reports, and your health records.",
  DOCTOR: "Manage availability, appointments, and prescriptions.",
  ADMIN: "Control doctor accounts and platform configuration.",
};

function DashboardSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = linksByRole[user?.role] || [];
  const role = user?.role || "USER";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="dashboard-sidebar">
      {/* ── Brand ── */}
      <div className="sidebar-top">
        <div className="sidebar-brand-wrap">
          <img src={logo} alt="CareSync360" className="sidebar-brand-logo" />
          <div>
            <div className="sidebar-brand">
              CareSync <span className="sidebar-brand-accent">360</span>
            </div>
            <p className="sidebar-role">{role.toLowerCase()}</p>
          </div>
        </div>

        {user?.name && <p className="sidebar-user">Signed in as {user.name}</p>}
        <p className="sidebar-role-hint">
          {roleHintByRole[role] || "Manage your dashboard workspace."}
        </p>
      </div>

      {/* ── Nav ── */}
      <nav
        className="sidebar-nav"
        aria-label={`${role.toLowerCase()} navigation`}
      >
        <p className="sidebar-nav-title">Navigation</p>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}>
            <Icon size={16} strokeWidth={1.5} className="sidebar-nav-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="sidebar-logout-wrap">
        <button type="button" className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={14} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
