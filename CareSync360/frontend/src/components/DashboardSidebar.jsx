import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linksByRole = {
  PATIENT: [
    { to: "/patient/dashboard", label: "Dashboard", short: "DB" },
    { to: "/patient/doctors", label: "Find Doctors", short: "DR" },
    { to: "/patient/book-appointment", label: "Book Appointment", short: "BK" },
    { to: "/patient/appointments", label: "My Appointments", short: "AP" },
    { to: "/patient/payments", label: "Payments", short: "PM" },
    { to: "/patient/profile", label: "My Profile", short: "PF" },
    { to: "/patient/reports", label: "My Reports", short: "RP" },
    { to: "/patient/prescriptions", label: "Prescriptions", short: "RX" }
  ],
  DOCTOR: [
    { to: "/doctor/dashboard", label: "Dashboard", short: "DB" },
    { to: "/doctor/appointments", label: "Appointments", short: "AP" },
    { to: "/doctor/profile", label: "My Profile", short: "PF" },
    { to: "/doctor/availability", label: "Availability", short: "AV" },
    { to: "/doctor/issue-prescription", label: "Issue Prescription", short: "RX" }
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", short: "DB" },
    { to: "/admin/create-doctor-account", label: "Manage Users", short: "MU" },
    { to: "/admin/create-doctor-profile", label: "Analytics", short: "AN" }
  ]
};

const iconPathByShort = {
  DB: "M3 3h8v8H3zm10 0h8v5h-8zM3 13h8v8H3zm10 7h8v-12h-8z",
  DR: "M8 5a3 3 0 100 6 3 3 0 000-6zm8 1h5M16 10h5M14 19a6 6 0 00-12 0",
  BK: "M7 2v3M17 2v3M4 7h16M5 4h14a1 1 0 011 1v15a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z",
  AP: "M12 7v5l3 3M12 22a10 10 0 100-20 10 10 0 000 20z",
  PM: "M4 7h16M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm5 8h2m-4 4h6",
  PF: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
  RP: "M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1v5h5",
  RX: "M7 7h10M12 3v18M5 11h14M7 17h10",
  AV: "M12 2v20M2 12h20",
  DA: "M12 5v14M5 12h14M3 5h6M15 19h6",
  DP: "M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z",
  MU: "M8 10a3 3 0 100-6 3 3 0 000 6zm8 2a3 3 0 100-6 3 3 0 000 6zM2 20a6 6 0 0112 0M10 20a6 6 0 0112 0",
  AN: "M4 20V9M10 20V4M16 20v-7M22 20H2"
};

const roleHintByRole = {
  PATIENT: "Track appointments, reports, and your health records.",
  DOCTOR: "Manage availability, appointments, and prescriptions.",
  ADMIN: "Control doctor accounts and platform configuration."
};

function DashboardSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = linksByRole[user?.role] || [];
  const role = user?.role || "USER";
  const isAdmin = role === "ADMIN";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`dashboard-sidebar dashboard-sidebar--${role.toLowerCase()}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand-wrap">
          <span className="sidebar-brand-mark">{isAdmin ? "C360" : "MC"}</span>
          <div>
            <div className="sidebar-brand">{isAdmin ? "CareLine360" : "medicare"}</div>
            <p className="sidebar-role">{isAdmin ? "admin portal" : role.toLowerCase()}</p>
          </div>
        </div>

        {user?.name && <p className="sidebar-user">Signed in as {user.name}</p>}
        <p className="sidebar-role-hint">{roleHintByRole[role] || "Manage your dashboard workspace."}</p>
      </div>

      <nav className="sidebar-nav" aria-label={`${role.toLowerCase()} navigation`}>
        <p className="sidebar-nav-title">Navigation</p>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            <span className="sidebar-link-mark sidebar-link-mark--icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d={iconPathByShort[link.short] || iconPathByShort.DB} />
              </svg>
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className="btn btn-outline sidebar-logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

export default DashboardSidebar;
