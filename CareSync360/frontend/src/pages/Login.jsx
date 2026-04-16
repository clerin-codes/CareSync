import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { roleHomePath, useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import loginImg from "../assets/images/login.png";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, isAuthenticated } = useAuth();
  const redirectTarget = location.state?.from;

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectTarget || roleHomePath(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate, redirectTarget]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const loggedInUser = await login(form);
      const targetPath = redirectTarget || roleHomePath(loggedInUser.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-noise" />

      {/* ── Form Panel (Left) ── */}
      <div className="auth-form-panel">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Link to="/" className="auth-home-btn">
            <ArrowLeft size={14} strokeWidth={1.5} />
            Home
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
          {/* Logo */}
          <div className="auth-logo-wrapper">
            <div className="auth-logo-ring">
              <img src={logo} alt="CareSync360" className="auth-logo" />
            </div>
          </div>

          {/* Brand */}
          <div className="auth-brand">
            <span className="auth-brand-name">
              CareSync <span className="auth-brand-accent">360</span>
            </span>
          </div>

          <span className="auth-overline">Welcome Back</span>
          <h1 className="auth-title">
            Sign <span className="auth-title-accent">In</span>
          </h1>
          <p className="auth-subtitle">
            Access your healthcare dashboard securely
          </p>

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
              <label className="auth-label" htmlFor="login-email">
                Email
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-email"
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                <Mail size={15} strokeWidth={1.5} className="auth-input-icon" />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label" htmlFor="login-password">
                Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="login-password"
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{ paddingRight: "3rem" }}
                  required
                />
                <Lock size={15} strokeWidth={1.5} className="auth-input-icon" />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="auth-pw-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={15} strokeWidth={1.5} />
                  ) : (
                    <Eye size={15} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              <span className="btn-slide-bg" />
              <span className="btn-text">
                {loading ? (
                  <>
                    <span className="auth-spinner" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={14} />
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

          <div className="auth-footer-links">
            <Link to="/register-patient" className="auth-link">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Image Panel (Right) ── */}
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
          <p className="auth-panel-overline">CareSync 360</p>
          <h2 className="auth-panel-title">
            Your Health,
            <br />
            Our <em>Priority</em>
          </h2>
        </motion.div>

        <motion.img
          src={loginImg}
          alt="Healthcare professionals"
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

export default Login;
