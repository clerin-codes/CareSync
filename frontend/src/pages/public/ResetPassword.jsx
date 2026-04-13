import { useState } from "react";
import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../services/authService";

import logo from "../../assets/logo.png";
import resetImg from "../../assets/images/login.png";
import "../../pages/public/Auth.css";

export default function ResetPassword() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.otp.trim() || !form.newPassword.trim() || !form.confirmPassword.trim()) {
      setError("All fields are required.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword({
        otp: form.otp,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setMessage(data.message || "Password reset successfully.");

      setForm({
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        nav("/login");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-noise" />

      <div className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link to="/login" className="auth-home-btn">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Login
          </Link>
        </motion.div>

        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="auth-logo-wrapper">
            <div className="auth-logo-ring">
              <img src={logo} alt="CareSync" className="auth-logo" />
            </div>
          </div>

          <div className="auth-brand">
            <span className="auth-brand-name">
              Care<span className="auth-brand-accent">Sync</span>
            </span>
          </div>

          <span className="auth-overline">Reset Password</span>
          <h1 className="auth-title">
            Create <span className="auth-title-accent">New Password</span>
          </h1>
          <p className="auth-subtitle">
            Enter your reset token and choose a secure password for your account.
          </p>

          {message && (
            <motion.div
              className="auth-msg auth-msg--success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {message}
            </motion.div>
          )}

          {error && (
            <motion.div
              className="auth-msg auth-msg--error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label" htmlFor="otp">
                Enter OTP
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="otp"
                  name="otp"
                  className="auth-input"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <FaSyncAlt className="auth-input-icon" size={14} />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="newPassword">
                New Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="newPassword"
                  name="newPassword"
                  className="auth-input"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((s) => !s)}
                  className="auth-pw-toggle"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? (
                    <EyeOff size={15} strokeWidth={1.5} />
                  ) : (
                    <Eye size={15} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  className="auth-input"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="auth-pw-toggle"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} strokeWidth={1.5} />
                  ) : (
                    <Eye size={15} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn">
              <span className="btn-slide-bg" />
              <span className="btn-text">
                {loading ? "Resetting..." : "Reset Password"}
              </span>
            </button>
          </form>

          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or</span>
            <span className="auth-divider-line" />
          </div>

          <div className="auth-footer-links auth-footer-links--center">
            <span className="auth-footer-text">Remembered your password?</span>
            <Link to="/login" className="auth-link auth-link--accent">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="auth-image-panel">
        <div className="auth-float-circle auth-float-circle--1" />
        <div className="auth-float-circle auth-float-circle--2" />
        <div className="auth-float-circle auth-float-circle--3" />
        <div className="auth-img-glow auth-img-glow--right" />

        <motion.div
          className="auth-panel-overlay auth-panel-overlay--left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="auth-panel-overline">CareSync</p>
          <h2 className="auth-panel-title">
            Secure Your
            <br />
            Account <em>Again</em>
          </h2>
        </motion.div>

        <motion.img
          src={resetImg}
          alt="Reset password"
          className="auth-hero-img"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </div>
    </div>
  );
}