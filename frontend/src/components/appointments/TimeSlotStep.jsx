import { Video, User, Phone } from "lucide-react";
import { TIME_SLOTS, CONSULTATION_TYPES } from "../../utils/constants";

const TYPE_ICONS = { video: Video, "in-person": User, phone: Phone };

export default function TimeSlotStep({ date, time, consultationType, notes, onChange }) {
  const today = new Date().toISOString().split("T")[0];

  const handleField = (field, value) => {
    onChange({ date, time, consultationType, notes, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Pick Date & Time</h2>
        <p className="text-sm text-gray-500">Choose your preferred appointment slot.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => handleField("date", e.target.value)}
          min={today}
          className="w-full h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => handleField("time", slot)}
              className={`py-2 px-1 text-xs font-medium rounded-xl border transition-all ${
                time === slot
                  ? "bg-[#0d9488] text-white border-[#0d9488] shadow-md"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#0d9488]/40 hover:bg-teal-50/50"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
        <div className="grid grid-cols-3 gap-3">
          {CONSULTATION_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t.value] || Video;
            const isSelected = consultationType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => handleField("consultationType", t.value)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-[#0d9488] bg-teal-50/50 shadow-md"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? "text-[#0d9488]" : "text-gray-400"}`} />
                <span className={`text-xs font-medium ${isSelected ? "text-[#0d9488]" : "text-gray-600"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => handleField("notes", e.target.value)}
          rows={2}
          placeholder="Any additional information for the doctor..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
        />
      </div>
    </div>
  );
}
