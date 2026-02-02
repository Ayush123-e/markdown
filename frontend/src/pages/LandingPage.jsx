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
      title: "Video-Integrated Learning",
      description: "Transform any YouTube video into an interactive study session with seamless playback controls and real-time note synchronization."
    },
    {
      icon: FiBook,
      title: "Smart Note-Taking",
      description: "Rich text editor with advanced formatting, lists, links, and the ability to save and download your notes for offline access."
    },
    {
      icon: FiZap,
      title: "AI-Powered Assistant",
      description: "Get instant answers and explanations from our intelligent tutor powered by Google Gemini, available 24/7 during your study sessions."
    }
  ]; const steps = [
    {
      number: "1",
      title: "Paste YouTube Link",
      description: "Simply paste any educational YouTube video URL to create a new study session instantly."
    },
    {
      number: "2",
      title: "Watch & Take Notes",
      description: "Watch the video while taking comprehensive notes with our powerful rich text editor."
    },
    {
      number: "3",
      title: "Get AI Assistance",
      description: "Ask questions and get instant clarifications from the AI tutor to enhance your understanding."
    }
  ];




  const highlights = [
    "Video-synchronized note-taking",
    "AI tutor integration",
    "Download & save notes",
    "Unlimited study sessions"
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="landing-hero">
        {/* Navigation */}
        <nav className="landing-nav">
          <div className="landing-nav-brand">
            <div className="landing-nav-logo">
              <FiVideo size={24} style={{ color: 'white' }} />
            </div>
            <h1 className="landing-nav-title">
              Study<span>Space</span>
            </h1>
          </div>

          <div className="landing-nav-buttons">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="landing-nav-btn-dashboard"
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
          <h1 className="landing-hero-title">
            Master Any Subject with
            <br />
            <span className="highlight">AI-Powered</span> Learning
          </h1>

          <p className="landing-hero-subtitle">
            Revolutionary platform that combines video learning, intelligent note-taking,
            and AI assistance to accelerate your learning journey and boost retention.
          </p>

          <div className="landing-hero-cta-wrapper">
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="landing-hero-cta-btn primary"
            >
              <FiPlay size={20} />
              {isLoggedIn ? "Go to Dashboard" : "Start Learning Now"}
            </Link>
            {!isLoggedIn && (
              <Link to="/login" className="landing-hero-cta-btn secondary">
                Sign In
                <FiArrowRight size={20} />
              </Link>
            )}
          </div>

          <div className="landing-hero-features">
            {highlights.map((highlight, idx) => (
              <div key={idx} className="landing-hero-feature">
                <div className="landing-hero-feature-icon">
                  <FiCheck size={14} />
                </div>
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="landing-features">
        <div className="landing-features-header">
          <h2 className="landing-features-title">Powerful Features for Better Learning</h2>
          <p className="landing-features-subtitle">
            Everything you need to transform passive watching into active learning
          </p>
        </div>

        <div className="landing-features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="landing-feature-card">
              <div className="landing-feature-icon">
                <feature.icon size={32} style={{ color: '#FF6B6B' }} />
              </div>
              <h3 className="landing-feature-title">{feature.title}</h3>
              <p className="landing-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="landing-how-it-works">
        <div className="landing-how-it-works-content">
          <h2 className="landing-how-it-works-title">How It Works</h2>
          <p className="landing-how-it-works-subtitle">
            Get started in three simple steps
          </p>

          <div className="landing-steps">
            {steps.map((step, idx) => (
              <div key={idx} className="landing-step">
                <div className="landing-step-number">{step.number}</div>
                <h3 className="landing-step-title">{step.title}</h3>
                <p className="landing-step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Footer */}
      <div className="landing-footer">
        <p className="landing-footer-text">
          © 2026 StudySpace. Powered by Google Gemini AI • Built for learners worldwide
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
