import { useState } from "react";
import Dialog from "../ui/Dialog";

function StarPicker({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);

  return (
    <div
      className="rating-stars"
      role="radiogroup"
      aria-label="Star rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = (hover || value) >= star;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            className={`rating-star${active ? " rating-star--active" : ""}`}
            onMouseEnter={() => setHover(star)}
            onClick={() => onChange(star)}
            disabled={disabled}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function RatingModal({ open, appointment, onClose, onSubmit, submitting, error }) {
  const [stars, setStars] = useState(0);
  const [review, setReview] = useState("");

  const handleClose = () => {
    if (submitting) return;
    setStars(0);
    setReview("");
    onClose();
  };

  const handleSubmit = () => {
    if (!stars) return;
    onSubmit({ stars, review: review.trim() });
  };

  return (
    <Dialog
      open={open}
      title="Rate your doctor"
      description={appointment ? `Share feedback for Dr. ${appointment.doctorName}.` : ""}
      onClose={handleClose}
      actions={
        <>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !stars}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </>
      }
    >
      <div className="rating-modal-body">
        <label className="rating-modal-label">
          Your Rating
          <StarPicker value={stars} onChange={setStars} disabled={submitting} />
        </label>

        <label className="rating-modal-label">
          Review (optional)
          <textarea
            rows="4"
            value={review}
            onChange={(event) => setReview(event.target.value.slice(0, 500))}
            placeholder="How was your consultation?"
            disabled={submitting}
            maxLength={500}
          />
          <span className="booking-field-hint">{review.length}/500 characters</span>
        </label>

        {error ? <p className="form-error">{error}</p> : null}
      </div>
    </Dialog>
  );
}

export default RatingModal;
