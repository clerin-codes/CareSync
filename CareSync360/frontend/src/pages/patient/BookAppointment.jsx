import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import BookingStepper from "../../components/appointments/BookingStepper";
import DoctorStep from "../../components/appointments/DoctorStep";
import ScheduleStep from "../../components/appointments/ScheduleStep";
import ReasonStep from "../../components/appointments/ReasonStep";
import ConfirmStep from "../../components/appointments/ConfirmStep";
import { useToast } from "../../components/ui/ToastProvider";
import { appointmentService } from "../../services/appointmentService";
import { doctorService } from "../../services/doctorService";
import { paymentService } from "../../services/paymentService";
import { formatCurrency } from "../../utils/formatters";

const STEP_LABELS = ["Doctor", "Schedule", "Reason", "Confirm"];

const getTodayLocalDate = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

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

function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const preselectedDoctorId = searchParams.get("doctorId") || "";
  const preselectedDate = searchParams.get("appointmentDate") || "";
  const preselectedTimeSlot = searchParams.get("timeSlot") || "";
  const minBookingDate = useMemo(() => getTodayLocalDate(), []);

  const [step, setStep] = useState(0);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotError, setSlotError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    doctorProfileId: preselectedDoctorId,
    appointmentDate: preselectedDate,
    timeSlot: preselectedTimeSlot,
    reason: ""
  });

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor._id === form.doctorProfileId) || null,
    [doctors, form.doctorProfileId]
  );

  useEffect(() => {
    const loadDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const data = await doctorService.getDoctors();
        setDoctors(Array.isArray(data) ? data : []);
      } catch {
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    loadDoctors();
  }, []);

  const loadAvailableSlots = useCallback(async (doctorProfileId, appointmentDate) => {
    if (!doctorProfileId || !appointmentDate) {
      setAvailableSlots([]);
      setSlotError("");
      setForm((prev) => ({ ...prev, timeSlot: "" }));
      return;
    }

    setLoadingSlots(true);
    setSlotError("");

    try {
      const data = await appointmentService.getAvailableSlots({ doctorProfileId, appointmentDate });
      const slots = Array.isArray(data.availableSlots) ? data.availableSlots : [];
      setAvailableSlots(slots);
      setForm((prev) => ({
        ...prev,
        timeSlot: slots.includes(prev.timeSlot) ? prev.timeSlot : slots[0] || ""
      }));
    } catch (err) {
      setAvailableSlots([]);
      setForm((prev) => ({ ...prev, timeSlot: "" }));
      setSlotError(err.response?.data?.message || "Failed to load available slots.");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    loadAvailableSlots(form.doctorProfileId, form.appointmentDate);
  }, [form.doctorProfileId, form.appointmentDate, loadAvailableSlots]);

  const selectDoctor = (doctorProfileId) => {
    setError("");
    setForm((prev) => ({ ...prev, doctorProfileId }));
  };

  const setAppointmentDate = (appointmentDate) => {
    setError("");
    setForm((prev) => ({ ...prev, appointmentDate }));
  };

  const selectSlot = (timeSlot) => {
    setError("");
    setForm((prev) => ({ ...prev, timeSlot }));
  };

  const setReason = (reason) => {
    setError("");
    setForm((prev) => ({ ...prev, reason }));
  };

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return Boolean(form.doctorProfileId);
      case 1:
        return Boolean(form.appointmentDate && form.timeSlot);
      case 2:
        return form.reason.trim().length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, form]);

  const goNext = () => {
    setError("");
    if (!canAdvance) return;
    setStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1));
  };

  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const confirmAndCheckout = async () => {
    setError("");
    setSubmitting(true);

    let appointmentId = null;
    try {
      const data = await appointmentService.bookAppointment(form);
      appointmentId = data.appointment?._id;
      if (!appointmentId) {
        throw new Error("Appointment creation did not return an id");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to book appointment.";
      setError(message);
      toast.error("Booking failed", message);
      setSubmitting(false);
      return;
    }

    try {
      const result = await paymentService.createCheckoutSession({
        appointmentId,
        amount: Number(selectedDoctor?.consultationFee || 0)
      });

      if (!result.checkoutUrl) {
        throw new Error("Checkout URL was not returned");
      }

      toast.success("Appointment booked", "Redirecting you to secure checkout...");
      window.location.assign(result.checkoutUrl);
    } catch (err) {
      const message = err.response?.data?.message || "Unable to start checkout. You can pay from the Payments tab.";
      toast.info("Appointment saved", message);
      navigate(`/patient/payments?appointmentId=${encodeURIComponent(appointmentId)}`);
    }
  };

  return (
    <section className="dashboard-page book-appointment-page">
      <PageHeader
        title="Book Appointment"
        subtitle="Follow the steps to schedule your consultation and complete payment."
      />

      <div className="booking-layout">
        <div className="form-card booking-form-card">
          <BookingStepper steps={STEP_LABELS} currentStep={step} />

          <div className="booking-step-content">
            {step === 0 && (
              <DoctorStep
                doctors={doctors}
                loading={loadingDoctors}
                selectedId={form.doctorProfileId}
                onSelect={selectDoctor}
              />
            )}

            {step === 1 && (
              <ScheduleStep
                appointmentDate={form.appointmentDate}
                minBookingDate={minBookingDate}
                timeSlot={form.timeSlot}
                availableSlots={availableSlots}
                loadingSlots={loadingSlots}
                slotError={slotError}
                onDateChange={setAppointmentDate}
                onSlotSelect={selectSlot}
              />
            )}

            {step === 2 && <ReasonStep reason={form.reason} onChange={setReason} />}

            {step === 3 && (
              <ConfirmStep
                doctor={selectedDoctor}
                appointmentDate={form.appointmentDate}
                timeSlot={form.timeSlot}
                reason={form.reason}
                onEdit={setStep}
              />
            )}
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="booking-footer booking-footer--wizard">
            <button
              type="button"
              className="btn btn-outline"
              onClick={goBack}
              disabled={step === 0 || submitting}
            >
              Back
            </button>

            {step < STEP_LABELS.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={goNext}
                disabled={!canAdvance}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary booking-submit-btn"
                onClick={confirmAndCheckout}
                disabled={submitting}
              >
                {submitting ? "Booking..." : "Confirm & Pay"}
              </button>
            )}
          </div>
        </div>

        <aside className="booking-side">
          <div className="panel booking-summary-card">
            <h3>Booking Summary</h3>
            <div className="booking-summary-grid">
              <div className="booking-summary-row">
                <span className="booking-summary-label">Doctor</span>
                <span
                  className={
                    selectedDoctor
                      ? "booking-summary-value"
                      : "booking-summary-value booking-summary-value--muted"
                  }
                >
                  {selectedDoctor ? selectedDoctor.name : "Not selected"}
                </span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">Specialization</span>
                <span
                  className={
                    selectedDoctor?.specialization
                      ? "booking-summary-value"
                      : "booking-summary-value booking-summary-value--muted"
                  }
                >
                  {selectedDoctor?.specialization || "Not selected"}
                </span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">Date</span>
                <span
                  className={
                    form.appointmentDate
                      ? "booking-summary-value"
                      : "booking-summary-value booking-summary-value--muted"
                  }
                >
                  {formatAppointmentDate(form.appointmentDate)}
                </span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">Time Slot</span>
                <span
                  className={
                    form.timeSlot
                      ? "booking-summary-value"
                      : "booking-summary-value booking-summary-value--muted"
                  }
                >
                  {form.timeSlot || "Not selected"}
                </span>
              </div>
              <div className="booking-summary-row">
                <span className="booking-summary-label">Consultation Fee</span>
                <span
                  className={
                    selectedDoctor
                      ? "booking-summary-value"
                      : "booking-summary-value booking-summary-value--muted"
                  }
                >
                  {selectedDoctor ? formatCurrency(selectedDoctor.consultationFee, "LKR") : "Not available"}
                </span>
              </div>
            </div>
          </div>

          <div className="panel booking-help-card">
            <h3>What Happens Next</h3>
            <ul className="booking-help-list">
              <li>Your slot is reserved once you confirm.</li>
              <li>Payment runs immediately via secure checkout.</li>
              <li>The doctor still needs to accept your request.</li>
              <li>Manage or cancel from My Appointments.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default BookAppointment;
