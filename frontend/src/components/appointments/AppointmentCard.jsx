import { Link } from "react-router-dom";
import { Calendar, Clock, Video, User, Phone, RefreshCw, X, ChevronRight } from "lucide-react";
import { STATUS_COLORS, PRIORITY_COLORS } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";

const PRIORITY_ACCENT = {
  urgent: "border-l-rose-500",
  high: "border-l-orange-500",
  medium: "border-l-amber-400",
  low: "border-l-gray-300",
};

const TYPE_ICON = { video: Video, "in-person": User, phone: Phone };
const TYPE_LABEL = { video: "Video Call", "in-person": "In Person", phone: "Phone Call" };

export default function AppointmentCard({ appointment, currentUserRole, onReschedule, onCancel, onConfirm, onComplete }) {
  const { _id, patient, doctor, date, time, consultationType, status, priority } = appointment;
  const isPatient = currentUserRole === "patient";
  const TypeIcon = TYPE_ICON[consultationType] || Video;
  const personName = isPatient ? (doctor?.fullName || "Doctor") : (patient?.fullName || "Patient");

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 border-l-4 ${PRIORITY_ACCENT[priority] || "border-l-gray-300"} group`}>
      <div className="p-5">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#06b6d4] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
            {getInitials(personName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link to={`/patient/appointments/${_id}`} className="text-[#0d9488] hover:text-[#0b7c72] font-semibold text-[15px] transition block truncate">
                  {isPatient ? `Dr. ${personName}` : personName}
                </Link>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${PRIORITY_COLORS[priority]}`}>{priority}</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${STATUS_COLORS[status]}`}>{status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg ring-1 ring-gray-100">
            <Calendar className="w-3.5 h-3.5 text-[#0d9488]" /> {formatDate(date)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg ring-1 ring-gray-100">
            <Clock className="w-3.5 h-3.5 text-[#0d9488]" /> {time}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg ring-1 ring-gray-100">
            <TypeIcon className="w-3.5 h-3.5 text-[#0d9488]" /> {TYPE_LABEL[consultationType] || consultationType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {status === "confirmed" && onReschedule && (
              <button onClick={() => onReschedule(appointment)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 font-medium ring-1 ring-amber-200/60 transition">
                <RefreshCw className="w-3 h-3" /> Reschedule
              </button>
            )}
            {(status === "pending" || status === "confirmed") && onCancel && (
              <button onClick={() => onCancel(appointment)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 font-medium ring-1 ring-red-200/60 transition">
                <X className="w-3 h-3" /> Cancel
              </button>
            )}
            {onConfirm && status === "pending" && (
              <button onClick={() => onConfirm(appointment)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-[#0d9488] text-white rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] font-medium shadow-sm transition">
                Confirm
              </button>
            )}
            {onComplete && status === "confirmed" && (
              <button onClick={() => onComplete(appointment)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 active:scale-[0.98] font-medium shadow-sm transition">
                Complete
              </button>
            )}
          </div>
          <Link to={`/patient/appointments/${_id}`} className="inline-flex items-center gap-0.5 text-xs text-gray-400 hover:text-[#0d9488] font-medium transition opacity-0 group-hover:opacity-100">
            Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
