import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Overview", path: "/patient/dashboard" },
  { label: "My Profile", path: "/patient/profile" },
  { label: "My Documents", path: "/patient/documents" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="flex flex-col items-start gap-4 rounded-[1.75rem] bg-slate-950/80 p-5 text-slate-100 shadow-glow">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-400 to-sky-500 text-lg font-semibold text-slate-950">
          {user?.fullName?.split(" ")?.map((part) => part[0])?.join("") || "PS"}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Patient</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{user?.fullName || "Patient Name"}</h2>
        </div>
        <p className="text-sm text-slate-400">A calm dashboard for your health records and documents.</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900/80 text-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.2)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {item.label}
            <span className="text-slate-500">â†’</span>
          </NavLink>
        ))}
      </nav>

      <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5 text-sm text-slate-300">
        <p className="font-semibold text-slate-100">Next steps</p>
        <p className="mt-3 text-sm leading-6 text-slate-400">Keep your documents up to date and complete your profile for better care coordination.</p>
      </div>

      <button onClick={handleLogout} className="btn-secondary w-full">
        Sign Out
      </button>
    </aside>
  );
}

