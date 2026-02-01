import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiUserPlus, FiVideo, FiStar, FiTrendingUp } from "react-icons/fi";
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

  const benefits = [
    { icon: FiVideo, title: 'Video-Based Learning', text: 'Learn from any YouTube video' },
    { icon: FiStar, title: 'AI-Powered Assistance', text: 'Get instant help from AI tutors' },
    { icon: FiTrendingUp, title: 'Track Your Progress', text: 'Save notes and build knowledge' }
  ];

  return (
    <div className="register-container">
      <div className="register-bg-blob-1" />
      <div className="register-bg-blob-2" />

      {/* Left Side - Registration Form */}
      <div className="register-left-panel">
        <div className="register-form-card">
          <div className="register-form-header">
            <h2 className="register-form-title">Create Account ✨</h2>
            <p className="register-form-subtitle">Join thousands of learners today</p>
          </div>

          {error && (
            <div className="register-error-box">
              <span className="register-error-icon">⚠️</span>
              <p className="register-error-text">{error}</p>
            </div>
          )}

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

      {/* Right Side - Benefits Panel */}
      <div className="register-right-panel">
        <div className="register-right-content">
          <div className="register-logo-box">
            <FiVideo size={40} style={{ color: 'white' }} />
          </div>

          <h1 className="register-title">Start Learning Smarter</h1>

          <p className="register-description">
            Join our community and experience the future of online learning with AI-powered tools.
          </p>

          <div className="register-benefits">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="register-benefit-card">
                <div className="register-benefit-icon">
                  <benefit.icon size={20} />
                </div>
                <div className="register-benefit-content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
