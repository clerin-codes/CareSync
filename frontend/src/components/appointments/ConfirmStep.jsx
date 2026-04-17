import { Calendar, Video, User, Phone, Stethoscope, AlertTriangle } from "lucide-react";
import { PRIORITY_COLORS } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";

const TYPE_ICONS = { video: Video, "in-person": User, phone: Phone };

export default function ConfirmStep({ doctor, date, time, consultationType, symptoms, priority, notes, onEdit, onConfirm, submitting }) {
  const TypeIcon = TYPE_ICONS[consultationType] || Video;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Confirm Booking</h2>
      <p className="text-sm text-gray-500 mb-5">Review your appointment details before confirming.</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#0d9488]" />
            <div>
              <p className="text-xs text-gray-500">Doctor</p>
              <p className="text-sm font-medium text-gray-900">Dr. {doctor?.fullName || "Selected"}</p>
              {doctor?.specialization && <p className="text-xs text-gray-400">{doctor.specialization}</p>}
            </div>
          </div>
          <button onClick={() => onEdit(1)} className="text-xs text-[#0d9488] hover:underline">Edit</button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0d9488]" />
            <div>
              <p className="text-xs text-gray-500">Date & Time</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(date)} at {time}</p>
            </div>
          </div>
          <button onClick={() => onEdit(2)} className="text-xs text-[#0d9488] hover:underline">Edit</button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <TypeIcon className="w-4 h-4 text-[#0d9488]" />
            <div>
              <p className="text-xs text-gray-500">Consultation Type</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{consultationType}</p>
            </div>
          </div>
          <button onClick={() => onEdit(2)} className="text-xs text-[#0d9488] hover:underline">Edit</button>
        </div>

        {symptoms && (
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-[#0d9488]" />
              <p className="text-xs text-gray-500">Symptoms</p>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${PRIORITY_COLORS[priority]}`}>
                {priority}
              </span>
            </div>
            <p className="text-sm text-gray-700 ml-6">{symptoms}</p>
          </div>
        )}

        {notes && (
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Notes</p>
            <p className="text-sm text-gray-700">{notes}</p>
          </div>
        )}
      </div>

      <button
        onClick={onConfirm}
        disabled={submitting}
        className="w-full mt-6 py-2.5 bg-[#0d9488] text-white text-sm font-medium rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] disabled:opacity-50 transition shadow-sm"
      >
        {submitting ? "Booking..." : "Confirm & Book Appointment"}
      </button>
    </div>
  );
}
