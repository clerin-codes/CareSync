import { formatCurrency } from "../../utils/formatters";

const formatAppointmentDate = (value) => {
  if (!value) return "Not selected";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

function ConfirmStep({ doctor, appointmentDate, timeSlot, reason, onEdit }) {
  return (
    <div className="booking-step-body">
      <div className="booking-step-header">
        <h2>Confirm Booking</h2>
        <p>Review your appointment details before proceeding to payment.</p>
      </div>

      <div className="confirm-review">
        <div className="confirm-row">
          <div>
            <span className="confirm-row__label">Doctor</span>
            <span className="confirm-row__value">{doctor?.name || "Not selected"}</span>
            {doctor?.specialization && (
              <span className="confirm-row__hint">{doctor.specialization}</span>
            )}
          </div>
          <button type="button" className="confirm-row__edit" onClick={() => onEdit(0)}>
            Edit
          </button>
        </div>

        <div className="confirm-row">
          <div>
            <span className="confirm-row__label">Date &amp; Time</span>
            <span className="confirm-row__value">
              {formatAppointmentDate(appointmentDate)}
              {timeSlot ? ` at ${timeSlot}` : ""}
            </span>
          </div>
          <button type="button" className="confirm-row__edit" onClick={() => onEdit(1)}>
            Edit
          </button>
        </div>

        <div className="confirm-row">
          <div>
            <span className="confirm-row__label">Consultation Fee</span>
            <span className="confirm-row__value">
              {doctor ? formatCurrency(doctor.consultationFee, "LKR") : "Not available"}
            </span>
          </div>
        </div>

        <div className="confirm-row confirm-row--stacked">
          <div>
            <span className="confirm-row__label">Reason</span>
            <span className="confirm-row__value confirm-row__value--text">
              {reason || "No reason provided"}
            </span>
          </div>
          <button type="button" className="confirm-row__edit" onClick={() => onEdit(2)}>
            Edit
          </button>
        </div>
      </div>

      <p className="booking-note">
        After you confirm, you&apos;ll be redirected to checkout to complete payment. The slot stays reserved while the doctor reviews your request.
      </p>
    </div>
  );
}

export default ConfirmStep;
