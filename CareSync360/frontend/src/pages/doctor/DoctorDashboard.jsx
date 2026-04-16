import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Clock,
  CalendarDays,
  Grid3x3,
  Calendar,
  UserCircle,
  Pill,
  ArrowRight,
} from "lucide-react";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { appointmentService } from "../../services/appointmentService";
import { doctorService } from "../../services/doctorService";

const toLocalIsoDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const formatDateLabel = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getSlotCount = (entry) => {
  if (!entry || !Array.isArray(entry.slots)) return 0;
  return entry.slots.filter((slot) => typeof slot === "string" && slot.trim())
    .length;
};

function DoctorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const [profileData, doctorAppointments] = await Promise.all([
          doctorService.getMyProfile(),
          appointmentService.getDoctorAppointments(),
        ]);

        setProfile(profileData);
        setAppointments(
          Array.isArray(doctorAppointments) ? doctorAppointments : [],
        );
      } catch {
        setProfile(null);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const availabilityEntries = useMemo(
    () => (Array.isArray(profile?.availability) ? profile.availability : []),
    [profile],
  );

  const availabilitySlotCount = availabilityEntries.reduce(
    (count, entry) => count + getSlotCount(entry),
    0,
  );

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "PENDING",
  ).length;

  const todayIsoDate = toLocalIsoDate(new Date());
  const todayAppointments = appointments.filter(
    (appointment) =>
      toLocalIsoDate(appointment.appointmentDate) === todayIsoDate,
  ).length;

  const profileCompletion = Math.round(
    ([
      Boolean(profile?.specialization),
      Number(profile?.experience) > 0,
      Boolean(profile?.hospital),
      Number(profile?.consultationFee) > 0,
    ].filter(Boolean).length /
      4) *
      100,
  );

  const availabilityPreview = availabilityEntries
    .map((entry, index) => {
      const label =
        formatDateLabel(entry?.date) || entry?.day || `Entry ${index + 1}`;
      const dateValue = formatDateLabel(entry?.date)
        ? new Date(entry.date).getTime()
        : Number.POSITIVE_INFINITY;
      return {
        label,
        slotCount: getSlotCount(entry),
        dateValue,
      };
    })
    .filter((entry) => entry.slotCount > 0)
    .sort((a, b) => a.dateValue - b.dateValue)
    .slice(0, 4);

  return (
    <section className="dashboard-page doctor-page doctor-home-page">
      <PageHeader
        title={`Welcome, Dr. ${user?.name || "Doctor"}`}
        subtitle="Review appointments, keep your profile complete, and manage patient-ready availability."
        action={
          <Link className="btn btn-primary" to="/doctor/appointments">
            Open Appointments
          </Link>
        }
      />

      {loading && <Loader label="Loading doctor dashboard..." />}

      {!loading && !profile && (
        <EmptyState
          title="Profile not found"
          message="Ask admin to create your doctor profile, then refresh this page."
          action={
            <Link className="btn btn-primary" to="/doctor/profile">
              Open Profile Page
            </Link>
          }
        />
      )}

      {!loading && profile && (
        <>
          {/* ── Stats ── */}
          <div className="dr-stats-grid">
            <article className="dr-stat-card">
              <div className="dr-stat-icon">
                <CalendarCheck size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="dr-stat-label">Appointments</p>
                <p className="dr-stat-value">{totalAppointments}</p>
                <p className="dr-stat-desc">Total consultations assigned.</p>
              </div>
            </article>

            <article className="dr-stat-card">
              <div className="dr-stat-icon dr-stat-icon--amber">
                <Clock size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="dr-stat-label">Pending</p>
                <p className="dr-stat-value">{pendingAppointments}</p>
                <p className="dr-stat-desc">Requests awaiting your decision.</p>
              </div>
            </article>

            <article className="dr-stat-card">
              <div className="dr-stat-icon dr-stat-icon--blue">
                <CalendarDays size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="dr-stat-label">Today</p>
                <p className="dr-stat-value">{todayAppointments}</p>
                <p className="dr-stat-desc">
                  Appointments scheduled for today.
                </p>
              </div>
            </article>

            <article className="dr-stat-card">
              <div className="dr-stat-icon dr-stat-icon--purple">
                <Grid3x3 size={20} strokeWidth={1.5} />
              </div>
              <div>
                <p className="dr-stat-label">Configured Slots</p>
                <p className="dr-stat-value">{availabilitySlotCount}</p>
                <p className="dr-stat-desc">Slots visible to patients.</p>
              </div>
            </article>
          </div>

          {/* ── Main layout ── */}
          <div className="dr-home-layout">
            {/* Quick Actions */}
            <div className="dr-panel">
              <p className="dr-panel-title">Quick Actions</p>
              <p className="dr-panel-subtitle">
                Move between key tasks without leaving the dashboard.
              </p>

              <div className="dr-actions-grid">
                <Link className="dr-action-card" to="/doctor/appointments">
                  <div className="dr-action-icon">
                    <Calendar size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="dr-action-title">Manage Appointments</p>
                    <p className="dr-action-desc">
                      Accept, reject, and complete consultation requests.
                    </p>
                  </div>
                </Link>

                <Link className="dr-action-card" to="/doctor/profile">
                  <div className="dr-action-icon">
                    <UserCircle size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="dr-action-title">Update Profile</p>
                    <p className="dr-action-desc">
                      Keep specialization, hospital and fee details current.
                    </p>
                  </div>
                </Link>

                <Link className="dr-action-card" to="/doctor/availability">
                  <div className="dr-action-icon">
                    <Clock size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="dr-action-title">Edit Availability</p>
                    <p className="dr-action-desc">
                      Publish dated slots patients can book immediately.
                    </p>
                  </div>
                </Link>

                <Link
                  className="dr-action-card"
                  to="/doctor/issue-prescription"
                >
                  <div className="dr-action-icon">
                    <Pill size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="dr-action-title">Issue Prescription</p>
                    <p className="dr-action-desc">
                      Create and store prescriptions with medicine details.
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Profile Snapshot */}
            <aside className="dr-panel">
              <p className="dr-panel-title">Profile Snapshot</p>
              <p className="dr-panel-subtitle">Your current profile details.</p>

              <div className="dr-summary-list">
                <div className="dr-summary-item">
                  <span>Specialization</span>
                  <strong>{profile.specialization || "Not set"}</strong>
                </div>
                <div className="dr-summary-item">
                  <span>Hospital</span>
                  <strong>{profile.hospital || "Not set"}</strong>
                </div>
                <div className="dr-summary-item">
                  <span>Consultation Fee</span>
                  <strong>
                    {Number(profile.consultationFee) > 0
                      ? `LKR ${Number(profile.consultationFee).toLocaleString()}`
                      : "Not set"}
                  </strong>
                </div>
                <div className="dr-summary-item">
                  <span>Completion</span>
                  <strong>{profileCompletion}%</strong>
                </div>
              </div>

              <div className="dr-completion-bar-wrap">
                <div className="dr-completion-label">
                  <span>Profile completeness</span>
                  <span>{profileCompletion}%</span>
                </div>
                <div className="dr-completion-bar">
                  <div
                    className="dr-completion-fill"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
              </div>

              <span className="dr-panel-section-label">
                Upcoming Availability
              </span>
              {availabilityPreview.length === 0 ? (
                <p className="dr-muted-note">No dated slots configured yet.</p>
              ) : (
                <ul className="dr-slot-list">
                  {availabilityPreview.map((entry, index) => (
                    <li key={`${entry.label}-${index}`}>
                      <span>{entry.label}</span>
                      <strong>
                        {entry.slotCount} slot{entry.slotCount === 1 ? "" : "s"}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </aside>
          </div>
        </>
      )}
    </section>
  );
}

export default DoctorDashboard;
