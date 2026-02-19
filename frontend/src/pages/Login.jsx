import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiVideo, FiArrowLeft } from "react-icons/fi";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Header */}
      <div className="login-header">
        <Link to="/" className="login-back-btn">
          <FiArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="login-content">
        <div className="login-form-card">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">
              <FiVideo size={28} style={{ color: 'white' }} />
            </div>
            <h1 className="login-logo-title">
              Study<span>Space</span>
            </h1>
          </div>

          {/* Form Header */}
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome Back</h2>
            <p className="login-form-subtitle">Sign in to continue your learning journey</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="login-error-box">
              <span className="login-error-icon">⚠️</span>
              <p className="login-error-text">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrapper">
                <FiMail className="login-input-icon" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="login-input"
                />
              </div>
            </div>

            <div className="login-form-group">
              <label className="login-label">Password</label>
              <div className="login-input-wrapper">
                <FiLock className="login-input-icon" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="login-input"
                />
              </div>
            </div>

            <button type="submit" className="login-submit-btn">
              <FiLogIn size={20} />
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="login-footer-link">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
