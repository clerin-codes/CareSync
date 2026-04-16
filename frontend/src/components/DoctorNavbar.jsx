import { useMemo } from "react";
import { motion } from "framer-motion";

export default function DoctorNavbar() {
  const navItems = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/doctor/dashboard" },
    { label: "Appointments", href: "/doctor/appointments" },
  ], []);

  const activePath = typeof window !== "undefined" ? window.location.pathname : "";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="sticky top-0 z-10 backdrop-blur bg-white">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
          <div className="w-9 h-9 rounded-full bg-[#178d95]/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#178d95]" />
          </div>
          <span className="font-semibold text-[#178d95]">CareSync</span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Doctor</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {navItems.map((item) => {
            const isActive = activePath === item.href || (item.href !== "/" && activePath.startsWith(item.href));
            return (
              <a key={item.href} href={item.href}
                className={"relative py-1 transition-colors hover:text-[#178d95] duration-300" + (isActive ? " text-[#178d95] font-medium" : "")}>
                {item.label}
                {isActive && <motion.span layoutId="doc-nav-underline" className="absolute left-0 right-0 -bottom-2 h-[2px] bg-[#178d95] rounded-full" />}
              </a>
            );
          })}
        </div>

        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
          <span className="text-sm text-gray-600 hidden sm:block">Dr. {user.fullName || "Doctor"}</span>
          <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-[#178d95] text-white text-sm shadow-xl hover:bg-[#126b73] transition active:scale-[0.98]">
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
}
