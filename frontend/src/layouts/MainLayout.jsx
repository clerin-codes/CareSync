import { Outlet } from "react-router-dom";
import Navbar from "../components/PatientNavbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#040b16] text-slate-100">
      
      <main >
        <div className="pointer-events-none absolute inset-x-0 top-24 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(20,184,166,0.14),_transparent_24%)]" />
        <Outlet />
      </main>
    </div>
  );
}

