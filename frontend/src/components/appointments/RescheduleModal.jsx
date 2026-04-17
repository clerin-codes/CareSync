import { useState } from "react";
import { X } from "lucide-react";
import { rescheduleAppointment } from "../../services/appointmentService";
import { TIME_SLOTS } from "../../utils/constants";

export default function RescheduleModal({ appointment, isOpen, onClose, onRescheduled }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await rescheduleAppointment(appointment._id, date, time);
      onRescheduled();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reschedule");
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const inputClass = "w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Reschedule Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded-xl ring-1 ring-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
            <select value={time} onChange={(e) => setTime(e.target.value)} required className={inputClass}>
              <option value="">Select time</option>
              {TIME_SLOTS.map((slot) => (<option key={slot} value={slot}>{slot}</option>))}
            </select>
          </div>
          <div className="flex space-x-3">
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-[#0d9488] text-white text-sm font-medium rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] disabled:opacity-50 transition shadow-sm">
              {submitting ? "Rescheduling..." : "Reschedule"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
