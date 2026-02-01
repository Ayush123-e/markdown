import { Link, useNavigate } from "react-router-dom";
import { FiVideo, FiBook, FiZap, FiCheck, FiArrowRight, FiPlay } from "react-icons/fi";
import { useEffect, useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const features = [
    {
      icon: FiVideo,
      title: "Video-Based Learning",
      description: "Learn from any YouTube video with our integrated player and smart controls."
    },
    {
      icon: FiBook,
      title: "Smart Note-Taking",
      description: "Rich text editor with formatting, lists, and links to organize your thoughts."
    },
    {
      icon: FiZap,
      title: "AI Tutor Assistant",
      description: "Get instant help from our AI tutor powered by Google Gemini."
    }
  ];

  const benefits = [
    "Unlimited study sessions",
    "Save and download your notes",
    "AI-powered learning assistance",
    "Progress tracking",
    "Free forever"
  ];

  const stats = [
    { number: '100%', label: 'Free Forever' },
    { number: 'AI', label: 'Powered Tutoring' },
    { number: '∞', label: 'Unlimited Sessions' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="landing-hero">
        <div className="landing-hero-blob-1" />
        <div className="landing-hero-blob-2" />

        {/* Navigation */}
        <nav className="landing-nav">
          <div className="landing-nav-brand">
            <div className="landing-nav-logo">
              <FiVideo size={24} style={{ color: 'white' }} />
            </div>
            <h1 className="landing-nav-title">StudySpace</h1>
          </div>

          <div className="landing-nav-buttons">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="landing-nav-btn-dashboard"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="landing-nav-btn-signin">
                  Sign In
                </Link>
                <Link to="/register" className="landing-nav-btn-getstarted">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">Learn Smarter with AI</h1>
          <p className="landing-hero-subtitle">
            Transform any YouTube video into an interactive study session with AI-powered assistance and smart note-taking.
          </p>

          <div className="landing-hero-cta-wrapper">
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="landing-hero-cta-btn"
            >
              <FiPlay size={20} />
              {isLoggedIn ? "Go to Dashboard" : "Start Learning Free"}
            </Link>
          </div>

          {/* Stats */}
          <div className="landing-hero-stats">
            {stats.map((stat, idx) => (
              <div key={idx} className="landing-hero-stat">
                <div className="landing-hero-stat-number">{stat.number}</div>
                <div className="landing-hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-features">
        <div className="landing-features-header">
          <h2 className="landing-features-title">Everything You Need to Learn</h2>
          <p className="landing-features-subtitle">
            Powerful features designed to enhance your learning experience
          </p>
        </div>

        <div className="landing-features-grid">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="landing-feature-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div className="landing-feature-icon">
                <feature.icon size={28} style={{ color: 'white' }} />
              </div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="landing-cta">
        <div className="landing-cta-content">
          <h2 className="landing-cta-title">Ready to Start Learning?</h2>
          <p className="landing-cta-subtitle">
            Join thousands of learners using AI to master new skills
          </p>

          <div className="landing-cta-benefits">
            <div className="landing-cta-benefits-list">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="landing-cta-benefit-item">
                  <div className="landing-cta-benefit-check">
                    <FiCheck size={14} />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <Link
            to={isLoggedIn ? "/dashboard" : "/register"}
            className="landing-cta-btn"
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
            <FiArrowRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p className="landing-footer-text">
          © 2026 StudySpace. Powered by AI • Made with ❤️ for learners
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
