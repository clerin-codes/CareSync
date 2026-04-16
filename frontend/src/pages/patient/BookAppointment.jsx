import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAllDoctors } from "../../services/patientService";
import { createAppointment } from "../../services/appointmentService";
import PatientNavbar from "../../components/PatientNavbar";
import BookingStepper from "../../components/appointments/BookingStepper";
import TriageForm from "../../components/appointments/TriageForm";
import DoctorSelectStep from "../../components/appointments/DoctorSelectStep";
import TimeSlotStep from "../../components/appointments/TimeSlotStep";
import ConfirmStep from "../../components/appointments/ConfirmStep";

const STEPS = ["Triage", "Doctor", "Schedule", "Confirm"];

export default function BookAppointment() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [symptoms, setSymptoms] = useState("");
  const [priority, setPriority] = useState("low");
  const [doctorId, setDoctorId] = useState("");
  const [doctorObj, setDoctorObj] = useState(null);
  const [schedule, setSchedule] = useState({ date: "", time: "", consultationType: "video", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllDoctors()
      .then((res) => {
        const data = res.doctors || res.data || res;
        setDoctors(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const handleTriageAssess = (s, p) => {
    setSymptoms(s);
    setPriority(p);
    setStep(1);
  };

  const handleDoctorSelect = (id) => {
    setDoctorId(id);
    const doc = doctors.find((d) => d._id === id);
    setDoctorObj(doc);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      const data = {
        doctor: doctorId,
        date: schedule.date,
        time: schedule.time,
        consultationType: schedule.consultationType,
        symptoms: symptoms || "",
        notes: schedule.notes || "",
        priority: priority || "low",
      };
      const res = await createAppointment(data);
      const appointmentId = res.data?.data?._id;
      navigate(`/patient/payment/${appointmentId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedFromSchedule = schedule.date && schedule.time;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white">
      <PatientNavbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Book an Appointment</h1>
        <p className="text-sm text-gray-500 mb-6">Follow the steps to schedule your consultation.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl ring-1 ring-red-100">
            {error}
          </div>
        )}

        <BookingStepper currentStep={step} steps={STEPS} />

        <div className="max-w-2xl mx-auto">
          {step === 0 && <TriageForm onAssess={handleTriageAssess} />}

          {step === 1 && (
            <>
              <DoctorSelectStep selected={doctorId} onSelect={handleDoctorSelect} />
              <div className="flex justify-between mt-4">
                <button onClick={() => setStep(0)} className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(2)} disabled={!doctorId} className="px-6 py-2 bg-[#0d9488] text-white text-sm font-medium rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] disabled:opacity-50 transition shadow-sm">
                  Next
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <TimeSlotStep
                date={schedule.date}
                time={schedule.time}
                consultationType={schedule.consultationType}
                notes={schedule.notes}
                onChange={setSchedule}
              />
              <div className="flex justify-between mt-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!canProceedFromSchedule} className="px-6 py-2 bg-[#0d9488] text-white text-sm font-medium rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] disabled:opacity-50 transition shadow-sm">
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <ConfirmStep
                doctor={doctorObj}
                date={schedule.date}
                time={schedule.time}
                consultationType={schedule.consultationType}
                symptoms={symptoms}
                priority={priority}
                notes={schedule.notes}
                onEdit={setStep}
                onConfirm={handleConfirm}
                submitting={submitting}
              />
              <div className="mt-4">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
