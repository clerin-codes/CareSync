import { useState, useEffect, useCallback } from "react";
import { Calendar, Clock, CheckCircle, User, Video, Phone } from "lucide-react";
import { getDoctorAppointments } from "../../services/doctorService";
import { transitionStatus } from "../../services/appointmentService";
import { STATUS_COLORS, PRIORITY_COLORS } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";
import DoctorNavbar from "../../components/DoctorNavbar";

const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const TYPE_ICON = { video: Video, "in-person": User, phone: Phone };

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status) params.status = status;
      const res = await getDoctorAppointments(params);
      setAppointments(res.appointments || []);
      setPagination(res.pagination || null);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleAction = async (appointmentId, newStatus) => {
    setActionLoading(appointmentId);
    try {
      await transitionStatus(appointmentId, newStatus);
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white">
      <DoctorNavbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Patient Appointments</h1>
        <p className="text-sm text-gray-500 mb-6">Manage your patient consultations.</p>

        <div className="flex gap-1 mb-6 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button key={tab.key} onClick={() => { setStatus(tab.key); setPage(1); }}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${status === tab.key ? "bg-[#0d9488] text-white shadow-sm" : "text-gray-500 hover:bg-gray-100 bg-white border border-gray-100"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-10 h-10 border-[3px] border-teal-100 border-t-[#0d9488] rounded-full animate-spin" />
            <p className="mt-3 text-sm text-gray-400">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-16">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-700 mb-1">No appointments found</h3>
            <p className="text-sm text-gray-400">{status ? "Try a different filter." : "No appointments yet."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => {
              const TypeIcon = TYPE_ICON[apt.consultationType] || Calendar;
              const isActioning = actionLoading === apt._id;

              return (
                <div key={apt._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#06b6d4] flex items-center justify-center text-white text-sm font-bold">
                        {(apt.patient?.fullName || "P").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{apt.patient?.fullName || "Patient"}</p>
                        <p className="text-xs text-gray-400">{apt.patient?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${PRIORITY_COLORS[apt.priority]}`}>{apt.priority}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${STATUS_COLORS[apt.status]}`}>{apt.status}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg ring-1 ring-gray-100">
                      <Calendar className="w-3.5 h-3.5 text-[#0d9488]" /> {formatDate(apt.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg ring-1 ring-gray-100">
                      <Clock className="w-3.5 h-3.5 text-[#0d9488]" /> {apt.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg ring-1 ring-gray-100">
                      <TypeIcon className="w-3.5 h-3.5 text-[#0d9488]" /> {apt.consultationType}
                    </span>
                  </div>

                  {apt.symptoms && (
                    <p className="text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <span className="font-medium text-gray-600">Symptoms:</span> {apt.symptoms}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {apt.status === "pending" && (
                      <button onClick={() => handleAction(apt._id, "confirmed")} disabled={isActioning}
                        className="px-4 py-2 bg-[#0d9488] text-white text-xs font-medium rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] disabled:opacity-50 transition shadow-sm">
                        {isActioning ? "Confirming..." : "Confirm"}
                      </button>
                    )}
                    {apt.status === "confirmed" && (
                      <button onClick={() => handleAction(apt._id, "completed")} disabled={isActioning}
                        className="px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-xl hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 transition shadow-sm">
                        {isActioning ? "Completing..." : "Mark Complete"}
                      </button>
                    )}
                    {(apt.status === "pending" || apt.status === "confirmed") && (
                      <button onClick={() => handleAction(apt._id, "cancelled")} disabled={isActioning}
                        className="px-4 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-xl hover:bg-red-100 ring-1 ring-red-200/60 disabled:opacity-50 transition">
                        Cancel
                      </button>
                    )}
                    {apt.status === "completed" && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition ${page === p ? "bg-[#0d9488] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
