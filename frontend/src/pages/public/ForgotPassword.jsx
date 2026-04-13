import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setResetToken("");

    try {
      const data = await forgotPassword({ email });
      setMessage(data.message || "A reset token has been sent to your email.");
      if (data.resetToken) setResetToken(data.resetToken);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to process your request right now.");
    }
  };

  return (
    <section className="section-container flex min-h-[calc(100vh-160px)] items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.24)] backdrop-blur-xl"
      >
        <div className="mb-8 flex items-center gap-3 text-teal-300">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/70 text-xl text-white shadow-[0_12px_30px_rgba(20,184,166,0.25)]">
            <FaEnvelopeOpenText />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-teal-300/80">Password recovery</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Forgot your password?</h1>
          </div>
        </div>

        <p className="mb-8 text-slate-400">Enter the email linked to your CareSync account and we will send a secure reset token.</p>

        {message && <div className="mb-5 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{message}</div>}
        {error && <div className="mb-5 rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}
        {resetToken && <div className="mb-5 rounded-3xl border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-slate-100">Reset Token: <span className="font-semibold">{resetToken}</span></div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button className="btn-primary w-full" type="submit">Send reset token</button>
        </form>
      </motion.div>
    </section>
  );
}

