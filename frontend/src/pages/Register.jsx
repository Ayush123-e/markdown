import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
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
      const { data } = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split auth-split--flipped">
      {/* Left panel - form (panels swapped vs Login) */}
      <div className="auth-form-panel">
        <Link to="/" className="auth-back">
          <span>←</span> Back to Home
        </Link>

        <div className="auth-form-content">
          <div className="auth-form-header">
            <h1>Create an account.</h1>
            <p>Join thousands of students learning smarter.</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <FiUser className="auth-input-icon" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="auth-input"
                />
              </div>
            </div>

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
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="auth-input"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <FiArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right panel - brand */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark">S</div>
            <span>StudySpace</span>
          </Link>
          <div className="auth-brand-phrase">
            <h2>Your AI study<br />partner awaits.</h2>
            <p>Timestamp notes, AI tutoring, and<br />video integration — all in one place.</p>
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
              <strong>Free</strong>
              <span>Forever</span>
            </div>
          </div>
          <div className="auth-brand-geo" />
        </div>
      </div>
    </div>
  );
};

export default Register;
