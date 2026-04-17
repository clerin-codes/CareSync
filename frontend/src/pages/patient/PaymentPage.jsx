import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CreditCard, Lock, CheckCircle, Download } from "lucide-react";
import { getAppointmentById } from "../../services/appointmentService";
import { getPaymentByAppointment, createPayment, verifyPayment, downloadReceipt } from "../../services/paymentService";
import PatientNavbar from "../../components/PatientNavbar";

function formatCardNumber(value) { const digits = value.replace(/\D/g, "").slice(0, 16); return digits.replace(/(.{4})/g, "$1 ").trim(); }
function formatExpiry(value) { const digits = value.replace(/\D/g, "").slice(0, 4); if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2); return digits; }

export default function PaymentPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try { const res = await getAppointmentById(appointmentId); setAppointment(res.data?.data);
        try { const payRes = await getPaymentByAppointment(appointmentId); setPayment(payRes.data?.data); } catch {} }
      catch (err) { console.error("Failed to load appointment:", err); }
      finally { setLoading(false); }
    }; fetch();
  }, [appointmentId]);

  const validate = () => {
    const errs = {};
    if (cardNumber.replace(/\s/g, "").length !== 16) errs.cardNumber = "Card number must be 16 digits";
    if (!cardholderName.trim()) errs.cardholderName = "Cardholder name is required";
    const expParts = expiry.split("/");
    if (expParts.length !== 2 || expParts[0].length !== 2 || expParts[1].length !== 2) errs.expiry = "Use MM/YY format";
    else if (parseInt(expParts[0], 10) < 1 || parseInt(expParts[0], 10) > 12) errs.expiry = "Invalid month";
    if (cvv.length !== 3) errs.cvv = "CVV must be 3 digits";
    setErrors(errs); return Object.keys(errs).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setProcessing(true); setError("");
    try {
      const createRes = await createPayment({ appointment: appointmentId, amount: 3500, currency: "LKR", method: "card" });
      const verifyRes = await verifyPayment(createRes.data?.data?._id);
      setPayment(verifyRes.data?.data); setSuccess(true);
    } catch (err) { setError(err.response?.data?.message || "Payment failed"); }
    finally { setProcessing(false); }
  };

  const handleDownloadReceipt = async () => {
    if (!payment) return;
    try { const res = await downloadReceipt(payment._id); const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" })); const a = document.createElement("a"); a.href = url; a.download = `receipt-${payment.transactionRef || payment._id}.pdf`; a.click(); window.URL.revokeObjectURL(url); } catch {}
  };

  if (loading) return (<div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white"><PatientNavbar /><div className="flex justify-center py-20"><div className="w-10 h-10 border-[3px] border-teal-100 border-t-[#0d9488] rounded-full animate-spin" /></div></div>);
  if (!appointment) return (<div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white"><PatientNavbar /><div className="text-center py-12 text-gray-500">Appointment not found</div></div>);

  if (payment && !success) return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white"><PatientNavbar />
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500">Amount</p><p className="text-sm font-medium text-gray-900">LKR {payment.amount?.toLocaleString()}</p></div>
            <div><p className="text-xs text-gray-500">Status</p><p className="text-sm font-medium text-gray-900 capitalize">{payment.status}</p></div>
            {payment.transactionRef && <div><p className="text-xs text-gray-500">Ref</p><p className="text-sm font-mono text-gray-700">{payment.transactionRef}</p></div>}
          </div>
        </div>
        <Link to={`/patient/appointments/${appointmentId}`} className="block text-center mt-4 text-sm text-[#0d9488] hover:text-[#0b7c72] transition">View Appointment</Link>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white"><PatientNavbar />
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-emerald-600" /></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful</h2>
          <p className="text-sm text-gray-500 mb-4">Your consultation fee has been processed.</p>
          {payment?.transactionRef && <p className="text-xs text-gray-400 mb-6">Transaction Ref: <span className="font-mono">{payment.transactionRef}</span></p>}
          <div className="flex items-center justify-center gap-3">
            <Link to={`/patient/appointments/${appointmentId}`} className="inline-block px-6 py-2.5 bg-[#0d9488] text-white text-sm rounded-xl hover:bg-[#0b7c72] transition shadow-sm">View Appointment</Link>
            {payment?.status === "verified" && (<button onClick={handleDownloadReceipt} className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition"><Download className="w-4 h-4" /> Receipt</button>)}
          </div>
        </div>
      </div>
    </div>
  );

  const inputClass = (field) => `w-full h-11 rounded-xl border bg-gray-50 px-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition ${errors[field] ? "border-red-300" : "border-gray-200"}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6fbff] to-white"><PatientNavbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h1>
        <p className="text-sm text-gray-500 mb-6">Consultation with <span className="font-medium text-gray-700">{appointment.doctor?.fullName || "Doctor"}</span></p>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-xl ring-1 ring-red-100">{error}</div>}

        <div className="relative h-48 rounded-2xl bg-gradient-to-br from-[#0d9488] via-[#0891b2] to-[#06b6d4] p-6 mb-6 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 flex flex-col justify-between h-full text-white">
            <div className="flex justify-between items-start"><CreditCard className="w-10 h-10 opacity-80" /><Lock className="w-4 h-4 opacity-60" /></div>
            <div>
              <p className="text-lg font-mono tracking-[0.2em] mb-3">{cardNumber || "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022"}</p>
              <div className="flex justify-between items-end">
                <p className="text-sm font-medium uppercase tracking-wide opacity-90">{cardholderName || "YOUR NAME"}</p>
                <p className="text-sm font-mono opacity-80">{expiry || "MM/YY"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">Amount Due</span>
            <span className="text-2xl font-bold text-gray-900">LKR 3,500.00</span>
          </div>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label><input type="text" autoComplete="cc-name" value={cardholderName} onChange={(e) => setCardholderName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} placeholder="John Doe" className={inputClass("cardholderName")} />{errors.cardholderName && <p className="text-xs text-red-500 mt-1">{errors.cardholderName}</p>}</div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label><input type="text" autoComplete="cc-number" inputMode="numeric" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19} className={inputClass("cardNumber")} />{errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label><input type="text" autoComplete="cc-exp" inputMode="numeric" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" maxLength={5} className={inputClass("expiry")} />{errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">CVV</label><input type="text" autoComplete="cc-csc" inputMode="numeric" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="123" maxLength={3} className={inputClass("cvv")} />{errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}</div>
            </div>
          </div>
          <button onClick={handlePay} disabled={processing} className="w-full mt-6 py-3 bg-[#0d9488] text-white font-medium rounded-xl hover:bg-[#0b7c72] active:scale-[0.98] disabled:opacity-50 transition shadow-sm">{processing ? "Processing..." : "Pay LKR 3,500.00"}</button>
          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> Secure payment — simulated for demonstration purposes.</p>
        </div>
        <Link to={`/patient/appointments/${appointmentId}`} className="block text-center mt-4 text-sm text-gray-400 hover:text-[#0d9488] transition">Skip for now</Link>
      </div>
    </div>
  );
}
