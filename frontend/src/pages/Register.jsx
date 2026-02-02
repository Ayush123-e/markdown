import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiUserPlus, FiVideo, FiArrowLeft } from "react-icons/fi";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      {/* Header */}
      <div className="register-header">
        <Link to="/" className="register-back-btn">
          <FiArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="register-content">
        <div className="register-form-card">
          {/* Logo */}
          <div className="register-logo">
            <div className="register-logo-icon">
              <FiVideo size={28} style={{ color: 'white' }} />
            </div>
            <h1 className="register-logo-title">
              Study<span>Space</span>
            </h1>
          </div>

          {/* Form Header */}
          <div className="register-form-header">
            <h2 className="register-form-title">Create Account</h2>
            <p className="register-form-subtitle">Join thousands of learners today</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="register-error-box">
              <span className="register-error-icon">⚠️</span>
              <p className="register-error-text">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label className="register-label">Full Name</label>
              <div className="register-input-wrapper">
                <FiUser className="register-input-icon" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="register-input"
                />
              </div>
            </div>

            <div className="register-form-group">
              <label className="register-label">Email Address</label>
              <div className="register-input-wrapper">
                <FiMail className="register-input-icon" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="register-input"
                />
              </div>
            </div>

            <div className="register-form-group-last">
              <label className="register-label">Password</label>
              <div className="register-input-wrapper">
                <FiLock className="register-input-icon" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="register-input"
                />
              </div>
              <p className="register-password-hint">Must be at least 6 characters</p>
            </div>

            <button type="submit" className="register-submit-btn">
              <FiUserPlus size={20} />
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="register-footer">
            <p className="register-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="register-footer-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
