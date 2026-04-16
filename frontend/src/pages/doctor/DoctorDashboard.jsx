import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle, Users, Stethoscope } from "lucide-react";
import { getDoctorDashboard } from "../../services/doctorService";
import DoctorNavbar from "../../components/DoctorNavbar";

export default function DoctorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoctorDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white">
        <DoctorNavbar />
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-[3px] border-teal-100 border-t-[#0d9488] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white">
        <DoctorNavbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-xl ring-1 ring-red-100">{error}</div>
          <p className="mt-4 text-sm text-gray-500">Make sure you have created a doctor profile.</p>
        </div>
      </div>
    );
  }

  const { doctor, stats } = data || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white">
      <DoctorNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#0d9488] to-[#06b6d4] rounded-2xl px-6 py-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome, Dr. {doctor?.fullName}</h1>
              <p className="text-sm text-white/70">{doctor?.specialization} &middot; {doctor?.doctorId}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Calendar, label: "Total", value: stats?.total, color: "text-[#0d9488]" },
            { icon: Clock, label: "Pending", value: stats?.pending, color: "text-amber-500" },
            { icon: CheckCircle, label: "Confirmed", value: stats?.confirmed, color: "text-blue-500" },
            { icon: CheckCircle, label: "Completed", value: stats?.completed, color: "text-emerald-500" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <span className="text-xs text-gray-500">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value ?? 0}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Link to="/doctor/appointments" className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition group">
            <Calendar className="w-8 h-8 text-[#0d9488] mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0d9488] transition">Manage Appointments</h3>
            <p className="text-sm text-gray-500">View, confirm, and complete patient appointments.</p>
          </Link>
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Today's Appointments</h3>
            <p className="text-3xl font-bold text-gray-900">{stats?.todayCount ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
