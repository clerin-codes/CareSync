import { useState, useEffect } from "react";
import { Search, Star } from "lucide-react";
import { getAllDoctors } from "../../services/patientService";

export default function DoctorSelectStep({ selected, onSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllDoctors()
      .then((res) => {
        const data = res.doctors || res.data || res;
        setDoctors(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to load doctors:", err))
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const filtered = doctors.filter((doc) => {
    const name = (doc.fullName || "").toLowerCase();
    const spec = (doc.specialization || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || spec.includes(q);
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-[3px] border-teal-100 border-t-[#0d9488] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Select a Doctor</h2>
      <p className="text-sm text-gray-500 mb-4">Choose a doctor for your consultation.</p>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or specialization..."
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {filtered.map((doc) => {
            const isSelected = selected === doc.userId || doc._id;
            return (
              <button
                key={doc.userId || doc._id}
                type="button"
                onClick={() => onSelect(doc.userId || doc._id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-[#0d9488] bg-teal-50/50 shadow-md"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0d9488] to-[#06b6d4] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {getInitials(doc.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">Dr. {doc.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{doc.specialization || "General"}</p>
                    {doc.rating > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-500">{doc.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
