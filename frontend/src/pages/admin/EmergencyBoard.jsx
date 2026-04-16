import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function EmergencyBoard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Emergency Board</h1>
              <p className="text-sm text-slate-500">Responder and admin emergency management view.</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-slate-600 bg-slate-50">
            No live emergency queue is connected yet. This route is now ready and no longer returns 404.
          </div>

          <div className="mt-5 flex gap-3">
            <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm font-medium hover:bg-cyan-800 transition">
              Go to Admin Dashboard
            </Link>
            <Link to="/admin/patients" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition">
              View Patients
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
