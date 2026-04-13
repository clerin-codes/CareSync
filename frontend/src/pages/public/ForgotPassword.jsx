import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { forgotPassword } from "../../services/authService";

import logo from "../../assets/logo.png";
import forgotImg from "../../assets/images/login.png";
import "../../pages/public/Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);

      const data = await forgotPassword(email.trim());
      setMessage(data.message || "An OTP has been sent to your email.");

      setTimeout(() => {
        nav("/reset-password");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process your request right now."
      );
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

          <span className="auth-overline">Password Recovery</span>
          <h1 className="auth-title">
            Forgot <span className="auth-title-accent">Password?</span>
          </h1>
          <p className="auth-subtitle">
            Enter your email and we will send a secure OTP to reset your password
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
              <label className="auth-label" htmlFor="forgot-email">
                Email Address
              </label>

              <div className="auth-input-wrapper">
                <input
                  id="forgot-email"
                  className="auth-input"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Mail size={15} strokeWidth={1.5} className="auth-input-icon" />
              </div>
            </div>

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              <span className="btn-slide-bg" />
              <span className="btn-text">
                {loading ? (
                  <>
                    <span className="auth-spinner" /> Sending...
                  </>
                ) : (
                  <>
                    Send OTP <ArrowRight size={14} />
                  </>
                )}
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
            Recover Your
            <br />
            Account <em>Securely</em>
          </h2>
        </motion.div>

        <motion.img
          src={forgotImg}
          alt="Forgot password"
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