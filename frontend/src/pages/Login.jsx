import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiVideo, FiBook, FiZap } from "react-icons/fi";
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
      const { data } = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const features = [
    { icon: FiVideo, text: 'Watch & Learn from YouTube videos' },
    { icon: FiBook, text: 'Smart note-taking with rich editor' },
    { icon: FiZap, text: 'AI tutor powered by Gemini' }
  ];

  return (
    <div className="login-container">
      <div className="login-bg-blob-1" />
      <div className="login-bg-blob-2" />

      {/* Left Side - Info Panel */}
      <div className="login-left-panel">
        <div className="login-left-content">
          <div className="login-logo-box">
            <FiVideo size={40} style={{ color: 'white' }} />
          </div>

          <h1 className="login-title">StudySpace</h1>

          <p className="login-description">
            Transform your learning with AI-powered study sessions. Take notes, chat with AI tutors, and master any topic.
          </p>

          <div className="login-features">
            {features.map((feature, idx) => (
              <div key={idx} className="login-feature-card">
                <div className="login-feature-icon">
                  <feature.icon size={20} />
                </div>
                <span className="login-feature-text">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right-panel">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome Back! 👋</h2>
            <p className="login-form-subtitle">Sign in to continue your learning journey</p>
          </div>

          {error && (
            <div className="login-error-box">
              <span className="login-error-icon">⚠️</span>
              <p className="login-error-text">{error}</p>
            </div>
          )}

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
