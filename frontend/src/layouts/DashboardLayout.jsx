import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#04111f] text-slate-100">        
      <main >
        <Outlet />
      </main>
    </div>
  );
}

