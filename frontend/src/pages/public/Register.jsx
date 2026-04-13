import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle, FaCertificate } from "react-icons/fa";
import { registerUser } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
      const payload = {
        fullName: form.fullName,
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: "patient",
      };
      const data = await registerUser(payload);
      setMessage(data.message || "Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-container grid min-h-[calc(100vh-160px)] gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-xl"
      >
        <div className="absolute -right-14 top-10 h-40 w-40 rounded-full bg-gradient-to-br from-sky-400/20 to-teal-300/10 blur-3xl" />
        <div className="absolute left-10 bottom-12 h-32 w-32 rounded-full bg-slate-950/80 blur-2xl" />

        <span className="badge">Patient onboarding</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Start your premium patient journey.
        </h1>
        <p className="mt-6 max-w-xl text-slate-300">
          Register with CareSync and keep your medical history, documents, and profile details in one elegant patient portal.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
            <div className="flex items-center gap-3 text-teal-300">
              <FaUserCircle />
              <span className="font-semibold text-white">Patient centric</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">A calm registration experience designed for patients.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
            <div className="flex items-center gap-3 text-sky-300">
              <FaCertificate />
              <span className="font-semibold text-white">Clinical ready</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Prepared for secure hospital workflows and shared records.</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.24)] backdrop-blur-xl"
      >
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300/90">Register</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Create your patient account</h2>
          <p className="mt-3 text-sm text-slate-400">Provide your details below to save your medical profile securely.</p>
        </div>

        {message && <div className="mb-5 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{message}</div>}
        {error && <div className="mb-5 rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
            <input className="input" type="text" name="fullName" placeholder="John Doe" value={form.fullName} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input className="input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Phone</label>
            <input className="input" type="text" name="phone" placeholder="+1 555 012 3456" value={form.phone} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <input className="input" type="password" name="password" placeholder="Create a strong password" value={form.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Creating account..." : "Register now"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already registered? <Link to="/login" className="text-sky-300 transition hover:text-white">Login here</Link>
        </p>
      </motion.div>
    </section>
  );
}

