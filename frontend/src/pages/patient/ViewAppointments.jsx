import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, CheckCircle, CalendarPlus, SlidersHorizontal } from "lucide-react";
import { getAppointments, transitionStatus, getAppointmentStats } from "../../services/appointmentService";
import PatientNavbar from "../../components/PatientNavbar";
import AppointmentCard from "../../components/appointments/AppointmentCard";
import RescheduleModal from "../../components/appointments/RescheduleModal";
import CancelConfirmModal from "../../components/appointments/CancelConfirmModal";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "-date", label: "Newest" },
  { value: "date", label: "Oldest" },
  { value: "-priority", label: "Priority" },
];

export default function ViewAppointments() {
  const currentUserRole = localStorage.getItem("role") || "patient";
  const currentUserId = localStorage.getItem("userId");

  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sort: "-date", page: 1, limit: 10, status: "" });
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [stats, setStats] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (currentUserRole === "patient" && currentUserId) params.patient = currentUserId;
      if (currentUserRole === "doctor" && currentUserId) params.doctor = currentUserId;
      const res = await getAppointments(params);
      setAppointments(res.data?.appointments || []);
      setPagination(res.data?.pagination || null);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUserRole, filters]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  useEffect(() => {
    getAppointmentStats().then((res) => setStats(res.data?.data)).catch(() => {});
  }, []);

  const handleConfirm = async (apt) => { try { await transitionStatus(apt._id, "confirmed"); fetchAppointments(); } catch {} };
  const handleComplete = async (apt) => { try { await transitionStatus(apt._id, "completed"); fetchAppointments(); } catch {} };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white">
      <PatientNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#0d9488] to-[#06b6d4] rounded-2xl px-6 py-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white mb-1">My Appointments</h1>
              <p className="text-sm text-white/70">Track, manage and stay on top of your consultations.</p>
            </div>
            {currentUserRole === "patient" && (
              <Link to="/patient/book-appointment" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl backdrop-blur-sm transition border border-white/20">
                <CalendarPlus className="w-4 h-4" /> Book New
              </Link>
            )}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Calendar, label: "Total", value: stats.total, color: "text-[#0d9488]" },
              { icon: Clock, label: "Pending", value: stats.pending, color: "text-amber-500" },
              { icon: CheckCircle, label: "Confirmed", value: stats.confirmed, color: "text-blue-500" },
              { icon: CheckCircle, label: "Completed", value: stats.completed, color: "text-emerald-500" },
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
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex gap-1 overflow-x-auto">
              {STATUS_TABS.map((tab) => (
                <button key={tab.key} onClick={() => setFilters((f) => ({ ...f, status: tab.key, page: 1 }))}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    filters.status === tab.key ? "bg-[#0d9488] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
                  }`}>{tab.label}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select value={filters.sort} onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
                className="h-8 pl-2 pr-7 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition">
                {SORT_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition ${showFilters ? "bg-[#0d9488] text-white" : "bg-gray-50 text-gray-400 hover:text-gray-600 ring-1 ring-gray-200"}`}>
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {showFilters && (
            <div className="px-4 py-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">From</label>
                <input type="date" value={filters.dateFrom || ""} onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value, page: 1 }))}
                  className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">To</label>
                <input type="date" value={filters.dateTo || ""} onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value, page: 1 }))}
                  className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition" />
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 border-[3px] border-teal-100 border-t-[#0d9488] rounded-full animate-spin" />
            <p className="mt-3 text-sm text-gray-400">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-teal-50 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-[#0d9488]" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">No appointments found</h3>
            <p className="text-sm text-gray-400 mb-4">{filters.status ? "Try changing your filters." : "You don't have any upcoming appointments."}</p>
            {currentUserRole === "patient" && (
              <Link to="/patient/book-appointment" className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#0d9488] text-white text-sm font-medium rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] transition shadow-sm">
                <CalendarPlus className="w-4 h-4" /> Book Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <AppointmentCard key={apt._id} appointment={apt} currentUserRole={currentUserRole}
                onReschedule={setRescheduleTarget} onCancel={setCancelTarget}
                onConfirm={currentUserRole === "doctor" ? handleConfirm : undefined}
                onComplete={currentUserRole === "doctor" ? handleComplete : undefined} />
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setFilters((f) => ({ ...f, page }))}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition ${filters.page === page ? "bg-[#0d9488] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{page}</button>
            ))}
          </div>
        )}

        {rescheduleTarget && <RescheduleModal appointment={rescheduleTarget} isOpen={!!rescheduleTarget} onClose={() => setRescheduleTarget(null)} onRescheduled={() => { setRescheduleTarget(null); fetchAppointments(); }} />}
        {cancelTarget && <CancelConfirmModal appointment={cancelTarget} isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} onCancelled={() => { setCancelTarget(null); fetchAppointments(); }} />}
      </div>
    </div>
  );
}
