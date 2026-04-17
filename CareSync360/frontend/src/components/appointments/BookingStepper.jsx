function BookingStepper({ steps, currentStep }) {
  return (
    <div className="booking-steps">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const className = [
          "booking-step",
          isActive ? "booking-step--active" : "",
          isCompleted ? "booking-step--completed" : ""
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <span key={label} className={className}>
            {index + 1}. {label}
          </span>
        );
      })}
    </div>
  );
}

export default BookingStepper;
