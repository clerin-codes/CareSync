function ScheduleStep({
  appointmentDate,
  minBookingDate,
  timeSlot,
  availableSlots,
  loadingSlots,
  slotError,
  onDateChange,
  onSlotSelect
}) {
  const hasDoctorAndDate = Boolean(appointmentDate);

  const slotStatusText = (() => {
    if (!hasDoctorAndDate) return "Pick a date to view slots";
    if (loadingSlots) return "Checking slot availability...";
    if (slotError) return "Could not load slots";
    if (availableSlots.length === 0) return "No slots available for this day";
    return `${availableSlots.length} slot${availableSlots.length === 1 ? "" : "s"} available`;
  })();

  return (
    <div className="booking-step-body">
      <div className="booking-step-header">
        <h2>Pick Date &amp; Time</h2>
        <p>Choose your preferred appointment slot.</p>
      </div>

      <label className="booking-date-label">
        Appointment Date
        <input
          type="date"
          value={appointmentDate}
          onChange={(event) => onDateChange(event.target.value)}
          min={minBookingDate}
          required
        />
      </label>

      <div className="booking-slot-meta">
        <p className="booking-field-label">Slot Availability</p>
        <p className="booking-slot-status">{slotStatusText}</p>
      </div>

      <div className="booking-slot-picker">
        <p className="booking-field-label">Time Slot</p>
        {!hasDoctorAndDate ? (
          <div className="slot-grid-empty">Pick a date to load slots.</div>
        ) : loadingSlots ? (
          <div className="slot-grid-empty">Loading available slots...</div>
        ) : availableSlots.length === 0 ? (
          <div className="slot-grid-empty">No available slots for this date. Try another day.</div>
        ) : (
          <div className="slot-grid">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`slot-chip ${timeSlot === slot ? "slot-chip--active" : ""}`}
                onClick={() => onSlotSelect(slot)}
                aria-pressed={timeSlot === slot}
                aria-label={`Select time slot ${slot}`}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </div>

      {slotError && <p className="form-error">{slotError}</p>}
    </div>
  );
}

export default ScheduleStep;
