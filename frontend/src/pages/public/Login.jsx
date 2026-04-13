import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShieldAlt, FaStethoscope, FaLock } from "react-icons/fa";
import { loginUser } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const payload = { password: form.password };
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.phone.trim()) payload.phone = form.phone.trim();

      const data = await loginUser(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("Access granted - redirecting to your dashboard.");
      setTimeout(() => navigate("/patient/dashboard"), 500);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-container grid min-h-[calc(100vh-160px)] gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.22)] backdrop-blur-xl"
      >
        <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-gradient-to-br from-teal-400/20 to-sky-500/10 blur-3xl" />
        <div className="absolute left-8 bottom-14 h-36 w-36 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <span className="badge">Hospital grade</span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Secure access for your patient journey.
          </h1>
          <p className="mt-6 max-w-2xl text-slate-300">
            CareSync brings premium hospital management to patients with elegant records, secure forms, and effortless document control.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center gap-3 text-teal-300">
                <FaShieldAlt />
                <span className="font-semibold text-white">Trusted security</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Encrypted workflow and patient-first access controls.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center gap-3 text-sky-300">
                <FaStethoscope />
                <span className="font-semibold text-white">Modern healthcare</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">Insights, documents, and profile status in one calm place.</p>
            </div>
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
          <p className="text-sm uppercase tracking-[0.3em] text-teal-300/90">Patient sign in</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Login to your CareSync account</h2>
          <p className="mt-3 text-sm text-slate-400">Enter your email or phone and password for secure access.</p>
        </div>

        {error && <div className="mb-5 rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
        {success && <div className="mb-5 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
            <input
              className="input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Phone</label>
            <input
              className="input"
              type="text"
              name="phone"
              placeholder="+1 555 012 3456"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login securely"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/forgot-password" className="text-sky-300 transition hover:text-white">
            Forgot Password?
          </Link>
          <Link to="/register" className="font-medium text-white transition hover:text-teal-300">
            Create a patient account
          </Link>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-400">
          <div className="flex items-center gap-3 text-teal-300">
            <FaLock />
            <span className="font-semibold text-white">Protected patient access</span>
          </div>
          <p className="mt-3 leading-6">Your documents and profile are safeguarded by secure authentication and a trusted healthcare workflow.</p>
        </div>
      </motion.div>
    </section>
  );
}

