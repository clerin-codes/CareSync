import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDoctors } from "../../services/patientService";

export default function ManageDoctors() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllDoctors();
        setDoctors(Array.isArray(data?.doctors) ? data.doctors : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter((d) => {
      const values = [d.fullName, d.specialization, d.doctorId, d.phone].filter(Boolean).join(" ").toLowerCase();
      return values.includes(q);
    });
  }, [doctors, query]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Doctors</h1>
            <p className="text-sm text-slate-500">Public doctor directory for admin review.</p>
          </div>
          <Link to="/admin/dashboard" className="text-sm font-medium text-cyan-700 hover:underline">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-200"
            placeholder="Search by name, specialization, doctor ID, or phone"
          />
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100">{error}</div>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="text-slate-500">Loading doctors...</div>
          ) : filtered.length === 0 ? (
            <div className="text-slate-500">No doctors found.</div>
          ) : (
            filtered.map((doctor) => (
              <div key={doctor._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-lg font-semibold text-slate-900">{doctor.fullName || "Doctor"}</h3>
                <p className="text-sm text-cyan-700 mt-1">{doctor.specialization || "General"}</p>
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p>Doctor ID: {doctor.doctorId || "-"}</p>
                  <p>Phone: {doctor.phone || "-"}</p>
                  <p>Experience: {doctor.experience ? `${doctor.experience} years` : "-"}</p>
                  <p>Rating: {doctor.rating ?? 0}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
