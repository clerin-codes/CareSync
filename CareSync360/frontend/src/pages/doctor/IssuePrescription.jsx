import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Trash2, Download, FileText, ClipboardList } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { patientService } from "../../services/patientService";

const emptyMedicine = { name: "", dosage: "", instructions: "" };

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
};

function IssuePrescription() {
  const [searchParams] = useSearchParams();

  const prefilledPatientId = searchParams.get("patientId") || "";
  const prefilledAppointmentId = searchParams.get("appointmentId") || "";

  const [form, setForm] = useState({
    patientId: prefilledPatientId,
    appointmentId: prefilledAppointmentId,
    notes: "",
    medicines: [{ ...emptyMedicine }]
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [history, setHistory] = useState([]);
  const [patientReports, setPatientReports] = useState([]);
  const hasPatientContext = Boolean(form.patientId.trim());

  const loadHistory = async () => {
    try {
      const data = await patientService.getDoctorPrescriptions();
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    }
  };

  const loadPatientReports = async (patientId) => {
    if (!patientId) {
      setPatientReports([]);
      return;
    }

    try {
      const data = await patientService.getReportsByPatient(patientId);
      setPatientReports(Array.isArray(data) ? data : []);
    } catch {
      setPatientReports([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (prefilledPatientId) {
      loadPatientReports(prefilledPatientId);
    }
  }, [prefilledPatientId]);

  const updateMedicine = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      medicines: prev.medicines.map((medicine, medicineIndex) =>
        medicineIndex === index ? { ...medicine, [field]: value } : medicine
      )
    }));
  };

  const addMedicine = () => {
    setForm((prev) => ({ ...prev, medicines: [...prev.medicines, { ...emptyMedicine }] }));
  };

  const removeMedicine = (index) => {
    setForm((prev) => {
      if (prev.medicines.length === 1) return prev;
      return {
        ...prev,
        medicines: prev.medicines.filter((_, medicineIndex) => medicineIndex !== index)
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!hasPatientContext) {
      setError("Open this page from an appointment to issue a prescription.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        patientId: form.patientId.trim(),
        appointmentId: form.appointmentId.trim(),
        notes: form.notes.trim(),
        medicines: form.medicines.map((medicine) => ({
          name: medicine.name.trim(),
          dosage: medicine.dosage.trim(),
          instructions: medicine.instructions.trim()
        }))
      };

      const data = await patientService.issuePrescription(payload);
      setSuccess(data.message || "Prescription issued successfully.");
      setForm((prev) => ({ ...prev, notes: "", medicines: [{ ...emptyMedicine }] }));
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue prescription.");
    } finally {
      setSaving(false);
    }
  };

  const downloadReport = async (report) => {
    setError("");

    try {
      const blob = await patientService.downloadReport(report._id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = report.originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to download report.");
    }
  };

  return (
    <section className="dashboard-page doctor-page doctor-prescription-page">
      <PageHeader
        eyebrow="Clinical Workflow"
        title="Issue Prescription"
        subtitle="Create and store digital prescriptions with medicine instructions for each patient."
      />

      <div className="doctor-prescription-layout">
        <form className="dr-form-card doctor-prescription-form" onSubmit={handleSubmit}>
          {/* Context panel */}
          <div className="dr-form-head">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2>Consultation Context</h2>
                <p>Fill in notes and the medicine plan below.</p>
              </div>
              {hasPatientContext ? (
                <button
                  className="dr-btn dr-btn-outline"
                  type="button"
                  onClick={() => loadPatientReports(form.patientId.trim())}
                >
                  <FileText size={13} strokeWidth={1.5} />
                  Load Reports
                </button>
              ) : (
                <Link className="dr-btn dr-btn-outline" to="/doctor/appointments">
                  Go to Appointments
                </Link>
              )}
            </div>
          </div>

          <div className="dr-summary-list" style={{ marginBottom: "1.25rem" }}>
            <div className="dr-summary-item">
              <span>Patient Link</span>
              <strong>{hasPatientContext ? "Attached from appointment" : "Not selected"}</strong>
            </div>
            <div className="dr-summary-item">
              <span>Appointment Link</span>
              <strong>{form.appointmentId ? "Attached" : "Not attached"}</strong>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label className="dr-label" htmlFor="notes">Clinical Notes</label>
            <textarea
              id="notes"
              className="dr-input"
              rows="4"
              style={{ resize: "vertical" }}
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Diagnosis, follow-up instructions, and caution notes"
            />
          </div>

          {/* Medicine plan */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <span className="dr-panel-title">Medicine Plan</span>
            <button className="dr-btn dr-btn-outline" type="button" onClick={addMedicine}>
              <Plus size={13} strokeWidth={1.5} />
              Add Medicine
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
            {form.medicines.map((medicine, index) => (
              <div
                key={`medicine-${index}`}
                style={{
                  padding: "1rem",
                  background: "var(--dr-bg)",
                  border: "1px solid var(--dr-border)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: "0.75rem",
                  alignItems: "end",
                }}
              >
                <div>
                  <label className="dr-label" htmlFor={`med-name-${index}`}>Name *</label>
                  <input
                    id={`med-name-${index}`}
                    className="dr-input"
                    type="text"
                    value={medicine.name}
                    onChange={(event) => updateMedicine(index, "name", event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="dr-label" htmlFor={`med-dosage-${index}`}>Dosage</label>
                  <input
                    id={`med-dosage-${index}`}
                    className="dr-input"
                    type="text"
                    value={medicine.dosage}
                    onChange={(event) => updateMedicine(index, "dosage", event.target.value)}
                    placeholder="1 tablet twice daily"
                  />
                </div>
                <div>
                  <label className="dr-label" htmlFor={`med-instr-${index}`}>Instructions</label>
                  <input
                    id={`med-instr-${index}`}
                    className="dr-input"
                    type="text"
                    value={medicine.instructions}
                    onChange={(event) => updateMedicine(index, "instructions", event.target.value)}
                    placeholder="After meals"
                  />
                </div>
                <button
                  className="dr-avail-remove"
                  style={{ marginTop: 0 }}
                  type="button"
                  onClick={() => removeMedicine(index)}
                  disabled={form.medicines.length === 1}
                  aria-label="Remove medicine"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>

          {error   && <p className="dr-form-msg dr-form-msg--error">{error}</p>}
          {success && <p className="dr-form-msg dr-form-msg--success">{success}</p>}

          <button className="dr-btn dr-btn-primary" type="submit" disabled={saving}>
            <span>{saving ? "Issuing…" : "Issue Prescription"}</span>
          </button>
        </form>

        {/* ── Side panels ── */}
        <aside className="doctor-prescription-side">
          {/* Patient Reports */}
          <div className="dr-panel" style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <p className="dr-panel-title">Patient Reports</p>
              <span className="dr-badge dr-badge--accepted">{patientReports.length}</span>
            </div>

            {patientReports.length === 0 && (
              <p className="dr-muted-note">
                {hasPatientContext
                  ? "No reports found for this patient."
                  : "Open from an appointment to load patient reports."}
              </p>
            )}

            {patientReports.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {patientReports.map((report) => (
                  <div
                    key={report._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.65rem 0.75rem",
                      background: "var(--dr-bg)",
                      border: "1px solid var(--dr-border)",
                    }}
                  >
                    <div>
                      <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--dr-text)", marginBottom: "0.15rem" }}>
                        {report.title || "Medical Report"}
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "var(--dr-text-muted)" }}>{report.originalName}</p>
                      <p style={{ fontSize: "0.68rem", color: "var(--dr-text-light)" }}>{formatDateTime(report.createdAt)}</p>
                    </div>
                    <button
                      className="dr-action-btn dr-action-btn--prescribe"
                      type="button"
                      onClick={() => downloadReport(report)}
                    >
                      <Download size={12} strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          <div className="dr-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <p className="dr-panel-title">Issued Prescriptions</p>
              <span className="dr-badge dr-badge--accepted">{history.length}</span>
            </div>

            {history.length === 0 && <p className="dr-muted-note">No prescriptions issued yet.</p>}

            {history.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {history.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      padding: "0.65rem 0.75rem",
                      background: "var(--dr-bg)",
                      border: "1px solid var(--dr-border)",
                    }}
                  >
                    <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--dr-text)", marginBottom: "0.15rem" }}>
                      {item.patientName || "Patient"}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "var(--dr-text-muted)" }}>Apt: {item.appointmentId || "N/A"}</p>
                    <p style={{ fontSize: "0.68rem", color: "var(--dr-text-light)" }}>Issued: {formatDateTime(item.issuedDate)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default IssuePrescription;
