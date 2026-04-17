import { useMemo, useState } from "react";
import { formatCurrency } from "../../utils/formatters";

function DoctorStep({ doctors, loading, selectedId, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter((doctor) => {
      const name = (doctor.name || "").toLowerCase();
      const spec = (doctor.specialization || "").toLowerCase();
      return name.includes(q) || spec.includes(q);
    });
  }, [doctors, search]);

  return (
    <div className="booking-step-body">
      <div className="booking-step-header">
        <h2>Select a Doctor</h2>
        <p>Choose a doctor for your consultation.</p>
      </div>

      <input
        type="search"
        className="booking-search-input"
        placeholder="Search by name or specialization..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        disabled={loading}
      />

      {loading ? (
        <div className="booking-step-empty">Loading doctors...</div>
      ) : filtered.length === 0 ? (
        <div className="booking-step-empty">No doctors match your search.</div>
      ) : (
        <div className="doctor-option-grid">
          {filtered.map((doctor) => {
            const isSelected = selectedId === doctor._id;
            return (
              <button
                key={doctor._id}
                type="button"
                className={`doctor-option${isSelected ? " doctor-option--active" : ""}`}
                onClick={() => onSelect(doctor._id)}
                aria-pressed={isSelected}
              >
                <span className="doctor-option__name">{doctor.name}</span>
                <span className="doctor-option__spec">{doctor.specialization || "General"}</span>
                <span className="doctor-option__fee">
                  {formatCurrency(doctor.consultationFee, "LKR")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DoctorStep;
