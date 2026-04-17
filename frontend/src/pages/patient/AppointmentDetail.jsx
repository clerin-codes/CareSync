import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Video, User, Phone, ArrowLeft, Download } from "lucide-react";
import { getAppointmentById, transitionStatus } from "../../services/appointmentService";
import { getPaymentByAppointment, downloadReceipt } from "../../services/paymentService";
import { STATUS_COLORS, PRIORITY_COLORS } from "../../utils/constants";
import { formatDate } from "../../utils/formatDate";
import PatientNavbar from "../../components/PatientNavbar";
import RescheduleModal from "../../components/appointments/RescheduleModal";
import CancelConfirmModal from "../../components/appointments/CancelConfirmModal";

const TYPE_ICON = { video: Video, "in-person": User, phone: Phone };

export default function AppointmentDetail() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const currentUserRole = localStorage.getItem("role") || "patient";

  const fetchData = async () => {
    try {
      const res = await getAppointmentById(id);
      setAppointment(res.data?.data);
      try { const payRes = await getPaymentByAppointment(id); setPayment(payRes.data?.data); } catch {}
    } catch (err) { console.error("Failed to load appointment:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleConfirm = async () => { try { await transitionStatus(id, "confirmed"); fetchData(); } catch {} };
  const handleComplete = async () => { try { await transitionStatus(id, "completed"); fetchData(); } catch {} };
  const handleDownloadReceipt = async () => {
    if (!payment) return;
    try {
      const res = await downloadReceipt(payment._id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a"); a.href = url; a.download = `receipt-${payment.transactionRef || payment._id}.pdf`; a.click(); window.URL.revokeObjectURL(url);
    } catch { console.error("Failed to download receipt"); }
  };

  if (loading) return (<div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white"><PatientNavbar /><div className="flex justify-center py-20"><div className="w-10 h-10 border-[3px] border-teal-100 border-t-[#0d9488] rounded-full animate-spin" /></div></div>);
  if (!appointment) return (<div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white"><PatientNavbar /><div className="text-center py-16 text-gray-500">Appointment not found</div></div>);

  const { patient, doctor, date, time, consultationType, symptoms, notes, status, priority, rescheduleHistory, cancellationReason } = appointment;
  const TypeIcon = TYPE_ICON[consultationType] || Video;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white">
      <PatientNavbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/patient/appointments" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0d9488] transition mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Appointments
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Appointment Details</h1>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${PRIORITY_COLORS[priority]}`}>{priority}</span>
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_COLORS[status]}`}>{status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Doctor</p>
              <p className="text-sm font-medium text-gray-900">Dr. {doctor?.fullName || "N/A"}</p>
              <p className="text-xs text-gray-400">{doctor?.email}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Patient</p>
              <p className="text-sm font-medium text-gray-900">{patient?.fullName || "N/A"}</p>
              <p className="text-xs text-gray-400">{patient?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg ring-1 ring-gray-100"><Calendar className="w-4 h-4 text-[#0d9488]" /> {formatDate(date)}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg ring-1 ring-gray-100"><Clock className="w-4 h-4 text-[#0d9488]" /> {time}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg ring-1 ring-gray-100"><TypeIcon className="w-4 h-4 text-[#0d9488]" /> {consultationType}</span>
          </div>

          {symptoms && (<div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">Symptoms</p><p className="text-sm text-gray-700">{symptoms}</p></div>)}
          {notes && (<div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100"><p className="text-xs text-gray-500 mb-1">Notes</p><p className="text-sm text-gray-700">{notes}</p></div>)}
          {cancellationReason && (<div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-100"><p className="text-xs text-red-500 mb-1">Cancellation Reason</p><p className="text-sm text-red-700">{cancellationReason}</p></div>)}

          {rescheduleHistory?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Reschedule History</p>
              <div className="space-y-2">
                {rescheduleHistory.map((h, i) => (
                  <div key={i} className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 border border-gray-100">
                    {formatDate(h.previousDate)} at {h.previousTime} &rarr; rescheduled {new Date(h.rescheduledAt).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {currentUserRole === "doctor" && status === "pending" && (<button onClick={handleConfirm} className="px-5 py-2 bg-[#0d9488] text-white text-sm font-medium rounded-xl hover:bg-[#0b7c72] transition">Confirm</button>)}
          {currentUserRole === "doctor" && status === "confirmed" && (<button onClick={handleComplete} className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition">Mark Complete</button>)}
          {status === "confirmed" && (<button onClick={() => setRescheduleOpen(true)} className="px-5 py-2 bg-amber-50 text-amber-700 text-sm font-medium rounded-xl hover:bg-amber-100 ring-1 ring-amber-200/60 transition">Reschedule</button>)}
          {(status === "pending" || status === "confirmed") && (<button onClick={() => setCancelOpen(true)} className="px-5 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-xl hover:bg-red-100 ring-1 ring-red-200/60 transition">Cancel</button>)}
          {!payment && status !== "cancelled" && (<Link to={`/patient/payment/${id}`} className="px-5 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl hover:bg-blue-100 ring-1 ring-blue-200/60 transition">Make Payment</Link>)}
        </div>

        {payment && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Amount</p><p className="text-sm font-medium text-gray-900">LKR {payment.amount?.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><span className={`px-2 py-0.5 text-xs font-semibold rounded-full capitalize ${payment.status === "verified" ? "bg-green-100 text-green-800" : payment.status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{payment.status}</span></div>
              {payment.transactionRef && (<div><p className="text-xs text-gray-500">Transaction Ref</p><p className="text-sm font-mono text-gray-700">{payment.transactionRef}</p></div>)}
              {payment.verifiedAt && (<div><p className="text-xs text-gray-500">Verified</p><p className="text-sm text-gray-700">{new Date(payment.verifiedAt).toLocaleString()}</p></div>)}
            </div>
            {payment.status === "verified" && (<button onClick={handleDownloadReceipt} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9488] text-white text-sm rounded-xl hover:bg-[#0b7c72] transition"><Download className="w-4 h-4" /> Download Receipt</button>)}
          </div>
        )}

        <RescheduleModal appointment={appointment} isOpen={rescheduleOpen} onClose={() => setRescheduleOpen(false)} onRescheduled={() => { setRescheduleOpen(false); fetchData(); }} />
        <CancelConfirmModal appointment={appointment} isOpen={cancelOpen} onClose={() => setCancelOpen(false)} onCancelled={() => { setCancelOpen(false); fetchData(); }} />
      </div>
    </div>
  );
}
