import { useState } from "react";
import { assessPriority, getPriorityDescription } from "../../utils/triageLogic";
import { PRIORITY_COLORS } from "../../utils/constants";

export default function TriageForm({ onAssess }) {
  const [symptoms, setSymptoms] = useState("");
  const [priority, setPriority] = useState(null);

  const handleAssess = () => {
    const result = assessPriority(symptoms);
    setPriority(result);
    onAssess(symptoms, result);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptom Triage</h2>
      <p className="text-sm text-gray-500 mb-3">
        Describe your symptoms to help us assess the priority of your appointment.
      </p>
      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Describe your symptoms (e.g., headache, chest pain, fever...)"
        rows={3}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
      />
      <button
        onClick={handleAssess}
        disabled={!symptoms.trim()}
        className="mt-3 px-4 py-2 bg-[#0d9488] text-white text-sm rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
      >
        Assess Priority
      </button>

      {priority && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-700">Priority:</span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${PRIORITY_COLORS[priority]}`}>
              {priority}
            </span>
          </div>
          <p className="text-sm text-gray-500">{getPriorityDescription(priority)}</p>
        </div>
      )}
    </div>
  );
}
