import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, CalendarDays, Grid3x3 } from "lucide-react";
import EmptyState from "../../components/EmptyState";
import Loader from "../../components/Loader";
import PageHeader from "../../components/PageHeader";
import { doctorService } from "../../services/doctorService";

const emptyRow = { date: "", slots: "" };

const toInputDate = (value) => {
  if (!value) return "";
  const asText = value.toString().trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(asText)) return asText;

  const parsed = new Date(asText);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const getTodayDate = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const getSlotCount = (slotsText) =>
  slotsText
    .split(",")
    .map((slot) => slot.trim())
    .filter(Boolean).length;

const formatDateLabel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function DoctorAvailability() {
  const [rows, setRows] = useState([emptyRow]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileExists, setProfileExists] = useState(true);
  const [legacyCount, setLegacyCount] = useState(0);
  const minDate = useMemo(() => getTodayDate(), []);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await doctorService.getMyProfile();
        setProfileExists(true);

        const availabilityEntries = Array.isArray(data.availability)
          ? data.availability
          : [];
        let legacyEntries = 0;

        const mapped = availabilityEntries
          .map((item) => {
            const date = toInputDate(item?.date);
            if (!date) {
              legacyEntries += 1;
              return null;
            }

            return {
              date,
              slots: (item.slots || []).join(", "),
            };
          })
          .filter(Boolean);

        setRows(mapped.length > 0 ? mapped : [emptyRow]);
        setLegacyCount(legacyEntries);
      } catch (err) {
        setProfileExists(false);
        setError(err.response?.data?.message || "Doctor profile not found.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };

  const removeRow = (index) => {
    setRows((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, rowIndex) => rowIndex !== index);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const availability = rows
      .filter((row) => row.date.trim())
      .map((row) => ({
        date: row.date.trim(),
        slots: row.slots
          .split(",")
          .map((slot) => slot.trim())
          .filter(Boolean),
      }));

    if (availability.length === 0) {
      setError("Add at least one dated slot entry.");
      return;
    }

    if (availability.some((entry) => entry.slots.length === 0)) {
      setError("Each selected date must include at least one slot.");
      return;
    }

    setSaving(true);

    try {
      const data = await doctorService.updateMyAvailability({ availability });
      setSuccess(data.message || "Availability updated successfully.");
      setLegacyCount(0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setSaving(false);
    }
  };

  const configuredDateCount = rows.filter((row) => row.date.trim()).length;
  const configuredSlotCount = rows.reduce(
    (total, row) => total + getSlotCount(row.slots),
    0,
  );

  const upcomingEntries = rows
    .filter((row) => row.date.trim())
    .map((row) => ({
      date: row.date.trim(),
      slotCount: getSlotCount(row.slots),
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <section className="dashboard-page doctor-page doctor-availability-page">
      <PageHeader
        title="Availability"
        subtitle="Publish date-specific time slots. Patients can only book slots you list here."
      />

      {loading && <Loader label="Loading availability..." />}

      {!loading && !profileExists && (
        <EmptyState
          title="Profile not available"
          message={error || "Your doctor profile is not created yet by admin."}
        />
      )}

      {!loading && profileExists && (
        <div className="availability-layout">
          <form className="dr-form-card" onSubmit={handleSubmit}>
            {/* ── KPIs ── */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <article className="dr-stat-card" style={{ flex: 1 }}>
                <div className="dr-stat-icon">
                  <CalendarDays size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="dr-stat-label">Dates</p>
                  <p className="dr-stat-value">{configuredDateCount}</p>
                  <p className="dr-stat-desc">Date entries configured</p>
                </div>
              </article>
              <article className="dr-stat-card" style={{ flex: 1 }}>
                <div className="dr-stat-icon dr-stat-icon--purple">
                  <Grid3x3 size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="dr-stat-label">Slots</p>
                  <p className="dr-stat-value">{configuredSlotCount}</p>
                  <p className="dr-stat-desc">Total visible to patients</p>
                </div>
              </article>
            </div>

            {legacyCount > 0 && (
              <p className="dr-form-msg dr-form-msg--error">
                {legacyCount} legacy entry{legacyCount === 1 ? "" : "ies"}{" "}
                found. Save dated availability to replace.
              </p>
            )}

            {error && <p className="dr-form-msg dr-form-msg--error">{error}</p>}
            {success && (
              <p className="dr-form-msg dr-form-msg--success">{success}</p>
            )}

            {/* ── Rows ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              {rows.map((row, index) => (
                <div
                  className="dr-avail-row"
                  key={`${row.date || "new"}-${index}`}
                >
                  <div>
                    <label className="dr-label" htmlFor={`avail-date-${index}`}>
                      Date
                    </label>
                    <input
                      id={`avail-date-${index}`}
                      className="dr-input"
                      type="date"
                      min={minDate}
                      value={row.date}
                      onChange={(event) =>
                        updateRow(index, "date", event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label
                      className="dr-label"
                      htmlFor={`avail-slots-${index}`}
                    >
                      Time Slots
                    </label>
                    <input
                      id={`avail-slots-${index}`}
                      className="dr-input"
                      type="text"
                      placeholder="09:00 AM, 10:30 AM, 02:00 PM"
                      value={row.slots}
                      onChange={(event) =>
                        updateRow(index, "slots", event.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="dr-avail-remove"
                    onClick={() => removeRow(index)}
                    disabled={rows.length === 1}
                    aria-label="Remove entry"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="button"
                className="dr-btn dr-btn-outline"
                onClick={addRow}
              >
                <Plus size={14} strokeWidth={1.5} />
                Add Date
              </button>
              <button
                type="submit"
                className="dr-btn dr-btn-primary"
                disabled={saving}
              >
                <span>{saving ? "Saving…" : "Save Availability"}</span>
              </button>
            </div>
          </form>

          <aside className="availability-side">
            <div className="dr-panel" style={{ marginBottom: "1rem" }}>
              <p className="dr-panel-title">Booking Logic</p>
              <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                <li
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--dr-text-muted)",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}
                >
                  Only listed dated slots are visible on booking pages.
                </li>
                <li
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--dr-text-muted)",
                    marginBottom: "0.5rem",
                    lineHeight: "1.5",
                  }}
                >
                  Once booked, a slot is hidden until cancelled.
                </li>
                <li
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--dr-text-muted)",
                    lineHeight: "1.5",
                  }}
                >
                  Use a consistent time format so patients see clean options.
                </li>
              </ul>
            </div>

            <div className="dr-panel">
              <p className="dr-panel-title">Upcoming Dates</p>
              {upcomingEntries.length === 0 ? (
                <p className="dr-muted-note">
                  No upcoming availability entries.
                </p>
              ) : (
                <ul className="dr-slot-list">
                  {upcomingEntries.map((entry, index) => (
                    <li key={`${entry.date}-${index}`}>
                      <span>{formatDateLabel(entry.date)}</span>
                      <strong>
                        {entry.slotCount} slot{entry.slotCount === 1 ? "" : "s"}
                      </strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default DoctorAvailability;
