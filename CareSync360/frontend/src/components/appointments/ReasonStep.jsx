function ReasonStep({ reason, onChange }) {
  return (
    <div className="booking-step-body">
      <div className="booking-step-header">
        <h2>Consultation Reason</h2>
        <p>Describe symptoms, concerns, or what you want to discuss.</p>
      </div>

      <label className="booking-reason-label">
        Reason
        <textarea
          value={reason}
          onChange={(event) => onChange(event.target.value)}
          rows="6"
          placeholder="Brief description of symptoms or medical concerns..."
          required
          maxLength={500}
        />
      </label>
      <p className="booking-field-hint">{reason.length}/500 characters</p>
    </div>
  );
}

export default ReasonStep;
