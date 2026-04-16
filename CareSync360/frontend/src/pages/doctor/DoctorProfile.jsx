import { useEffect, useMemo, useState } from "react";
import { Stethoscope, Building2, Clock, DollarSign } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { doctorService } from "../../services/doctorService";

function DoctorProfile() {
  const [form, setForm] = useState({
    specialization: "",
    experience: 0,
    hospital: "",
    consultationFee: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileExists, setProfileExists] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await doctorService.getMyProfile();
        setProfileExists(true);
        setForm({
          specialization: data.specialization || "",
          experience: data.experience || 0,
          hospital: data.hospital || "",
          consultationFee: data.consultationFee || 0,
        });
      } catch (err) {
        setProfileExists(false);
        setError(
          err.response?.data?.message || "Doctor profile was not found.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        specialization: form.specialization,
        experience: Number(form.experience),
        hospital: form.hospital,
        consultationFee: Number(form.consultationFee),
      };
      const data = await doctorService.updateMyProfile(payload);
      setSuccess(data.message || "Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const completion = useMemo(() => {
    const checks = [
      Boolean(form.specialization.trim()),
      Number(form.experience) > 0,
      Boolean(form.hospital.trim()),
      Number(form.consultationFee) > 0,
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form]);

  return (
    <section className="dashboard-page doctor-page doctor-profile-page">
      <PageHeader
        title="My Profile"
        subtitle="Keep your professional details complete and accurate for patients."
      />

      {loading && <Loader label="Loading profile..." />}

      {!loading && !profileExists && (
        <EmptyState
          title="Profile not available"
          message={error || "Your doctor profile is not yet created by admin."}
        />
      )}

      {!loading && profileExists && (
        <div className="profile-layout">
          <form
            className="dr-form-card doctor-profile-form"
            onSubmit={handleSubmit}
          >
            <div className="dr-form-head">
              <h2>Professional Information</h2>
              <p>
                These details are shown when patients view your profile and book
                consultations.
              </p>
            </div>

            {error && <p className="dr-form-msg dr-form-msg--error">{error}</p>}
            {success && (
              <p className="dr-form-msg dr-form-msg--success">{success}</p>
            )}

            <div className="dr-form-grid">
              <div>
                <label className="dr-label" htmlFor="specialization">
                  <Stethoscope
                    size={11}
                    strokeWidth={1.5}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Specialization *
                </label>
                <input
                  id="specialization"
                  className="dr-input"
                  type="text"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Cardiology"
                  required
                />
              </div>

              <div>
                <label className="dr-label" htmlFor="experience">
                  <Clock
                    size={11}
                    strokeWidth={1.5}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Experience (Years) *
                </label>
                <input
                  id="experience"
                  className="dr-input"
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="dr-label" htmlFor="hospital">
                  <Building2
                    size={11}
                    strokeWidth={1.5}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Hospital *
                </label>
                <input
                  id="hospital"
                  className="dr-input"
                  type="text"
                  name="hospital"
                  value={form.hospital}
                  onChange={handleChange}
                  placeholder="e.g. General Hospital"
                  required
                />
              </div>

              <div>
                <label className="dr-label" htmlFor="consultationFee">
                  <DollarSign
                    size={11}
                    strokeWidth={1.5}
                    style={{ display: "inline", marginRight: "0.3rem" }}
                  />
                  Consultation Fee (LKR) *
                </label>
                <input
                  id="consultationFee"
                  className="dr-input"
                  type="number"
                  name="consultationFee"
                  value={form.consultationFee}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <button
                type="submit"
                className="dr-btn dr-btn-primary"
                disabled={saving}
              >
                <span>{saving ? "Saving…" : "Save Profile"}</span>
              </button>
            </div>
          </form>

          <aside className="profile-side">
            <div className="dr-panel" style={{ marginBottom: "1rem" }}>
              <p className="dr-panel-title">Profile Completion</p>
              <p className="dr-panel-subtitle">
                A complete profile builds patient trust before booking.
              </p>
              <div className="dr-completion-bar-wrap">
                <div className="dr-completion-label">
                  <span>Completeness</span>
                  <span>{completion}%</span>
                </div>
                <div
                  className="dr-completion-bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={completion}
                >
                  <div
                    className="dr-completion-fill"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="dr-panel" style={{ marginBottom: "1rem" }}>
              <p className="dr-panel-title">Current Preview</p>
              <div className="dr-summary-list">
                <div className="dr-summary-item">
                  <span>Specialization</span>
                  <strong>{form.specialization || "Not set"}</strong>
                </div>
                <div className="dr-summary-item">
                  <span>Experience</span>
                  <strong>{Number(form.experience) || 0} years</strong>
                </div>
                <div className="dr-summary-item">
                  <span>Hospital</span>
                  <strong>{form.hospital || "Not set"}</strong>
                </div>
                <div className="dr-summary-item">
                  <span>Fee</span>
                  <strong>
                    {Number(form.consultationFee) > 0
                      ? `LKR ${Number(form.consultationFee).toLocaleString()}`
                      : "Not set"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="dr-panel">
              <p className="dr-panel-title">Quality Tips</p>
              <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                <li
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--dr-text-muted)",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}
                >
                  Use a clear specialization label patients can understand.
                </li>
                <li
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--dr-text-muted)",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}
                >
                  Keep hospital details current if you practice in multiple
                  locations.
                </li>
                <li
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--dr-text-muted)",
                    lineHeight: "1.5",
                  }}
                >
                  Review consultation fee periodically to reflect current rates.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default DoctorProfile;
