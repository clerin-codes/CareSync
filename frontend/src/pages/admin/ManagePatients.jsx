import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPatients, updatePatientStatus } from "../../services/patientService";

const STATUS_OPTIONS = ["active", "inactive", "blocked"];

export default function ManagePatients() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllPatients({ limit: 200, sortBy: "createdAt", order: "desc" });
      setPatients(Array.isArray(data?.patients) ? data.patients : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => {
      const values = [p.fullName, p.email, p.phone, p.patientId].filter(Boolean).join(" ").toLowerCase();
      return values.includes(q);
    });
  }, [patients, query]);

  const onStatusChange = async (id, status) => {
    try {
      setSavingId(id);
      await updatePatientStatus(id, status);
      setPatients((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update patient status");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Patients</h1>
            <p className="text-sm text-slate-500">Admin view for patient accounts and status updates.</p>
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
            placeholder="Search by name, email, phone, or patient ID"
          />
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-100">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-100 text-slate-600 text-sm">
              <tr>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Patient ID</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={5}>Loading patients...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={5}>No patients found.</td>
                </tr>
              ) : (
                filtered.map((patient) => (
                  <tr key={patient._id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{patient.fullName || "-"}</div>
                      <div className="text-xs text-slate-500">{patient.gender || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <div>{patient.email || "-"}</div>
                      <div>{patient.phone || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{patient.patientId || "-"}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 uppercase">{patient.status || "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={patient.status || "active"}
                        onChange={(e) => onStatusChange(patient._id, e.target.value)}
                        disabled={savingId === patient._id}
                        className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
