import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  CheckSquare,
  FileText,
  CalendarDays,
  Clock,
  User,
  Mail,
} from "lucide-react";
import Dialog from "../../components/ui/Dialog";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { useToast } from "../../components/ui/ToastProvider";
import { appointmentService } from "../../services/appointmentService";

const statusOptions = ["ALL", "PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"];

const formatAppointmentDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

function DoctorAppointments() {
  const toast = useToast();
  const [status, setStatus] = useState("ALL");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [rejectingAppointment, setRejectingAppointment] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("Doctor is unavailable for this slot");
  const [savingRejection, setSavingRejection] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await appointmentService.getDoctorAppointments(status === "ALL" ? {} : { status });
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load doctor appointments.";
      setError(message);
      toast.error("Appointments unavailable", message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [status]);

  const handleAccept = async (id) => {
    setError("");
    setSuccess("");
    try {
      await appointmentService.acceptAppointment(id);
      const message = "Appointment accepted.";
      setSuccess(message);
      toast.success("Appointment accepted", "The patient can now proceed to payment and consultation.");
      loadAppointments();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to accept appointment.";
      setError(message);
      toast.error("Acceptance failed", message);
    }
  };

  const openRejectDialog = (appointment) => {
    setRejectingAppointment(appointment);
    setRejectionReason(appointment.rejectionReason || "Doctor is unavailable for this slot");
  };

  const closeRejectDialog = () => {
    setRejectingAppointment(null);
    setRejectionReason("Doctor is unavailable for this slot");
    setSavingRejection(false);
  };

  const handleReject = async () => {
    if (!rejectingAppointment) {
      return;
    }

    setSavingRejection(true);
    setError("");
    setSuccess("");

    try {
      await appointmentService.rejectAppointment(rejectingAppointment._id, {
        rejectionReason: rejectionReason.trim() || "Doctor is unavailable for this slot"
      });
      const message = "Appointment rejected.";
      setSuccess(message);
      toast.success("Appointment rejected", "The patient will see the reason in their timeline.");
      closeRejectDialog();
      loadAppointments();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reject appointment.";
      setError(message);
      toast.error("Rejection failed", message);
      setSavingRejection(false);
    }
  };

  const handleComplete = async (id) => {
    setError("");
    setSuccess("");
    try {
      await appointmentService.completeAppointment(id);
      const message = "Appointment marked as completed.";
      setSuccess(message);
      toast.success("Consultation completed", "Prescription issuance can continue from the completed visit.");
      loadAppointments();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to complete appointment.";
      setError(message);
      toast.error("Completion failed", message);
    }
  };

  const summary = useMemo(
    () => ({
      total: appointments.length,
      pending: appointments.filter((appointment) => appointment.status === "PENDING").length,
      accepted: appointments.filter((appointment) => appointment.status === "ACCEPTED").length,
      completed: appointments.filter((appointment) => appointment.status === "COMPLETED").length
    }),
    [appointments]
  );

  return (
    <section className="dashboard-page doctor-page doctor-appointments-page">
      <PageHeader
        eyebrow="Clinical Operations"
        title="Appointments"
        subtitle="Review requests, manage decisions, and move consultations forward."
        action={
          <Link className="dr-btn dr-btn-primary" to="/doctor/availability">
            <span>Edit Availability</span>
          </Link>
        }
      />

      {/* ── Summary Stat Cards ── */}
      <div className="dr-stats-grid" style={{ marginBottom: "1.5rem" }}>
        <article className="dr-stat-card">
          <div className="dr-stat-icon"><CalendarDays size={20} strokeWidth={1.5} /></div>
          <div>
            <p className="dr-stat-label">In View</p>
            <p className="dr-stat-value">{summary.total}</p>
            <p className="dr-stat-desc">Current filter total</p>
          </div>
        </article>
        <article className="dr-stat-card">
          <div className="dr-stat-icon dr-stat-icon--amber"><Clock size={20} strokeWidth={1.5} /></div>
          <div>
            <p className="dr-stat-label">Pending</p>
            <p className="dr-stat-value">{summary.pending}</p>
            <p className="dr-stat-desc">Awaiting decision</p>
          </div>
        </article>
        <article className="dr-stat-card">
          <div className="dr-stat-icon dr-stat-icon--blue"><CheckCircle size={20} strokeWidth={1.5} /></div>
          <div>
            <p className="dr-stat-label">Accepted</p>
            <p className="dr-stat-value">{summary.accepted}</p>
            <p className="dr-stat-desc">Ready for consultation</p>
          </div>
        </article>
        <article className="dr-stat-card">
          <div className="dr-stat-icon dr-stat-icon--purple"><CheckSquare size={20} strokeWidth={1.5} /></div>
          <div>
            <p className="dr-stat-label">Completed</p>
            <p className="dr-stat-value">{summary.completed}</p>
            <p className="dr-stat-desc">Finished visits</p>
          </div>
        </article>
      </div>

      {/* ── Filter + status messages ── */}
      <div className="dr-appt-filters">
        {statusOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={`dr-filter-btn${status === option ? " active" : ""}`}
            onClick={() => setStatus(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {error   ? <p className="dr-form-msg dr-form-msg--error">{error}</p>   : null}
      {success ? <p className="dr-form-msg dr-form-msg--success">{success}</p> : null}
      {loading ? <Loader label="Loading appointments..." /> : null}

      {!loading && appointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          message="Try another status filter or wait for new booking requests."
        />
      ) : null}

      {/* ── Appointment Cards ── */}
      {!loading && appointments.length > 0 ? (
        <div>
          {appointments.map((appointment) => (
            <article className="dr-appt-card" key={appointment._id}>
              <div className="dr-appt-header">
                <div>
                  <p className="dr-appt-patient">{appointment.patientName || "Patient"}</p>
                  <div className="dr-appt-meta">
                    <span className="dr-appt-meta-item">
                      <CalendarDays size={12} strokeWidth={1.5} />
                      {formatAppointmentDate(appointment.appointmentDate)}
                    </span>
                    <span className="dr-appt-meta-item">
                      <Clock size={12} strokeWidth={1.5} />
                      {appointment.timeSlot || "N/A"}
                    </span>
                    {appointment.patientEmail && (
                      <span className="dr-appt-meta-item">
                        <Mail size={12} strokeWidth={1.5} />
                        {appointment.patientEmail}
                      </span>
                    )}
                  </div>
                </div>
                {/* Status badge */}
                <span className={`dr-badge dr-badge--${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </span>
              </div>

              {appointment.reason && (
                <div className="dr-appt-reason">
                  <strong>Reason:</strong> {appointment.reason}
                </div>
              )}

              {appointment.rejectionReason && (
                <div className="dr-appt-reason" style={{ borderLeftColor: "#dc2626" }}>
                  <strong>Rejection reason:</strong> {appointment.rejectionReason}
                </div>
              )}

              <div className="dr-appt-meta" style={{ marginBottom: "0.75rem", fontSize: "0.72rem" }}>
                <span>{appointment.specialization || "General"}</span>
                <span>LKR {Number(appointment.consultationFee || 0).toLocaleString()}</span>
                <span style={{ fontFamily: "monospace", color: "var(--dr-text-light)" }}>{appointment._id}</span>
              </div>

              <div className="dr-appt-actions">
                {appointment.status === "PENDING" && (
                  <>
                    <button
                      className="dr-action-btn dr-action-btn--accept"
                      type="button"
                      onClick={() => handleAccept(appointment._id)}
                    >
                      <CheckCircle size={13} strokeWidth={1.5} />
                      Accept
                    </button>
                    <button
                      className="dr-action-btn dr-action-btn--reject"
                      type="button"
                      onClick={() => openRejectDialog(appointment)}
                    >
                      <XCircle size={13} strokeWidth={1.5} />
                      Reject
                    </button>
                  </>
                )}

                {appointment.status === "ACCEPTED" && (
                  <>
                    {appointment.meetingLink && (
                      <Link className="dr-action-btn dr-action-btn--prescribe" to={`/consultation/${appointment._id}`}>
                        <User size={13} strokeWidth={1.5} />
                        Consultation Room
                      </Link>
                    )}
                    <button
                      className="dr-action-btn dr-action-btn--complete"
                      type="button"
                      onClick={() => handleComplete(appointment._id)}
                    >
                      <CheckSquare size={13} strokeWidth={1.5} />
                      Mark Completed
                    </button>
                  </>
                )}

                {appointment.status === "COMPLETED" && appointment.meetingLink && (
                  <Link className="dr-action-btn dr-action-btn--prescribe" to={`/consultation/${appointment._id}`}>
                    <User size={13} strokeWidth={1.5} />
                    View Room
                  </Link>
                )}

                {(appointment.status === "ACCEPTED" || appointment.status === "COMPLETED") && (
                  <Link
                    className="dr-action-btn dr-action-btn--prescribe"
                    to={`/doctor/issue-prescription?patientId=${appointment.patientId}&appointmentId=${appointment._id}`}
                  >
                    <FileText size={13} strokeWidth={1.5} />
                    Issue Prescription
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Dialog
        open={Boolean(rejectingAppointment)}
        title="Reject Appointment"
        description="Provide the reason shown to the patient."
        onClose={closeRejectDialog}
        actions={
          <>
            <button type="button" className="dr-btn dr-btn-outline" onClick={closeRejectDialog}>
              Cancel
            </button>
            <button type="button" className="dr-btn dr-btn-primary" disabled={savingRejection} onClick={handleReject}>
              <span>{savingRejection ? "Saving…" : "Confirm Rejection"}</span>
            </button>
          </>
        }
      >
        <label className="dialog__field">
          Rejection Reason
          <textarea
            rows="4"
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Explain why this request cannot be accepted."
          />
        </label>
      </Dialog>
    </section>
  );
}

export default DoctorAppointments;
