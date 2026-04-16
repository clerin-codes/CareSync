import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserCog, CalendarDays, AlertTriangle } from "lucide-react";
import { getAllPatients, getAllDoctors } from "../../services/patientService";
import { getAppointmentStats } from "../../services/appointmentService";

function toArray(value) {
  if (Array.isArray(value)) return value;
  return [];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [patientsRes, doctorsRes, statsRes] = await Promise.all([
          getAllPatients({ limit: 100 }),
          getAllDoctors(),
          getAppointmentStats(),
        ]);

        setPatients(toArray(patientsRes?.patients));
        setDoctors(toArray(doctorsRes?.doctors));
        setStats(statsRes?.data || { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load admin dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = useMemo(
    () => [
      { label: "Total Patients", value: patients.length, icon: Users, color: "text-cyan-600" },
      { label: "Total Doctors", value: doctors.length, icon: UserCog, color: "text-emerald-600" },
      { label: "Appointments", value: stats.total || 0, icon: CalendarDays, color: "text-indigo-600" },
      { label: "Pending", value: stats.pending || 0, icon: AlertTriangle, color: "text-amber-600" },
    ],
    [patients.length, doctors.length, stats]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-64 bg-slate-200 rounded-xl animate-pulse" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-white rounded-2xl shadow-sm animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-cyan-700 to-blue-700 text-white p-6 shadow-md">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-cyan-100 mt-1">Monitor patients, doctors, and appointments from one place.</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100">{error}</div>}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{card.label}</span>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/admin/patients" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-slate-900">Manage Patients</h2>
            <p className="text-sm text-slate-500 mt-2">Review patient list and update account status.</p>
          </Link>

          <Link to="/admin/doctors" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-slate-900">Manage Doctors</h2>
            <p className="text-sm text-slate-500 mt-2">View registered doctors and profile details.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
