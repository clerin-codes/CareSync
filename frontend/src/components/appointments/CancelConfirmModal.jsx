import { useState } from "react";
import { X } from "lucide-react";
import { cancelAppointment } from "../../services/appointmentService";

export default function CancelConfirmModal({ appointment, isOpen, onClose, onCancelled }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await cancelAppointment(appointment._id, reason);
      onCancelled();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cancel Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="mb-3 p-2 bg-red-50 text-red-700 text-sm rounded-xl ring-1 ring-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-500">Are you sure you want to cancel this appointment? This action cannot be undone.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for cancellation</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} placeholder="Please provide a reason..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition" />
          </div>
          <div className="flex space-x-3">
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 transition shadow-sm">
              {submitting ? "Cancelling..." : "Confirm Cancel"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition">
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
