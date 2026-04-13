import { useState } from "react";
import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const [form, setForm] = useState({ resetToken: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = await resetPassword(form);
      setMessage(data.message || "Password reset successfully.");
      setForm({ resetToken: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset your password.");
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
        <div className="mb-8 flex items-center gap-3 text-sky-300">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900/70 text-xl text-white shadow-[0_12px_30px_rgba(56,189,248,0.25)]">
            <FaSyncAlt />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">Reset password</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Create a new secure password</h1>
          </div>
        </div>

        <p className="mb-8 text-slate-400">Use your reset token and choose a strong password to re-enter your CareSync account.</p>

        {message && <div className="mb-5 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">{message}</div>}
        {error && <div className="mb-5 rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Reset token</label>
            <input className="input" name="resetToken" placeholder="Enter reset token" value={form.resetToken} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">New password</label>
            <input className="input" type="password" name="newPassword" placeholder="New password" value={form.newPassword} onChange={handleChange} required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label>
            <input className="input" type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary w-full">Reset password</button>
        </form>
      </motion.div>
    </section>
  );
}

