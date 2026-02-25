import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* Left panel - brand */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">S</div>
            <span>StudySpace</span>
          </Link>
          <div className="auth-brand-phrase">
            <h2>Learn without<br />limits.</h2>
            <p>Paste a video. Take notes. Ask the AI.<br />That's it — no complexity.</p>
          </div>
          <div className="auth-brand-stats">
            <div className="auth-stat">
              <strong>2K+</strong>
              <span>Students</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <strong>10K+</strong>
              <span>Sessions</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <strong>100%</strong>
              <span>Free</span>
            </div>
          </div>
          <div className="auth-brand-geo" />
        </div>
      </div>

      {/* Right panel - form */}
      <div className="auth-form-panel">
        <Link to="/" className="auth-back">
          <span>←</span> Back to Home
        </Link>

        <div className="auth-form-content">
          <div className="auth-form-header">
            <h1>Welcome back.</h1>
            <p>Sign in to continue your learning journey.</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <FiMail className="auth-input-icon" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <FiLock className="auth-input-icon" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <FiArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
