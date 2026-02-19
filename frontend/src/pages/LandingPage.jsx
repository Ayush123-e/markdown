import { Link, useNavigate } from "react-router-dom";
import { FiVideo, FiBook, FiZap, FiCheck, FiArrowRight, FiPlay } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => observer.observe(el));

    return () => reveals.forEach((el) => observer.unobserve(el));
  }, []);

  const features = [
    {
      icon: FiVideo,
      number: "01",
      title: "Video-Integrated Learning",
      description:
        "Drop in any YouTube link. Your notes sync to the timestamp. Rewind, replay, annotate — the video becomes your textbook.",
    },
    {
      icon: FiBook,
      number: "02",
      title: "Notes That Actually Work",
      description:
        "Rich text, headers, lists, links. Save as a file, share it, or come back later. Your notes belong to you.",
    },
    {
      icon: FiZap,
      number: "03",
      title: "Ask Anything, Anytime",
      description:
        "Stuck on a concept? The AI tutor is right there beside the video. Ask in plain English. Get answers that make sense.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Paste a YouTube link",
      description: "Any educational video. Drop the URL and you're in.",
    },
    {
      number: "2",
      title: "Watch and write",
      description:
        "Notes panel sits right beside the video. No alt-tabbing, no losing your place.",
    },
    {
      number: "3",
      title: "Ask when you're stuck",
      description:
        "The AI tutor reads the context. You get a real answer, not a search result.",
    },
  ];

  const highlights = [
    "Timestamp-synced notes",
    "AI tutor, always available",
    "Download your notes",
    "No session limits",
  ];

  const testimonials = [
    {
      text: "I used to drown in video tutorials. Now I actually remember what I watch. It's like a second brain.",
      author: "Alex Chen",
      role: "CS Student"
    },
    {
      text: "The AI tutor explains things better than my actual professor. Seriously a game changer for my exams.",
      author: "Sarah Miller",
      role: "Med Student"
    },
    {
      text: "Being able to jump to the exact moment in a video from my notes is a feature I didn't know I needed.",
      author: "James Wilson",
      role: "Developer"
    }
  ];

  return (
    <div className="lp-root">
      {/* Background with modern gradient blobs */}
      <div className="lp-bg-gradient" />
      <div className="lp-bg-grid" />

      {/* NAV */}
      <nav className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-brand">
            <div className="lp-brand-icon">
              <FiVideo size={20} />
            </div>
            <span className="lp-brand-name">StudySpace</span>
          </div>

          <div className="lp-nav-actions">
            {isLoggedIn ? (
              <button
                className="lp-btn lp-btn-primary"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link to="/login" className="lp-nav-link">Sign In</Link>
                <Link to="/register" className="lp-btn lp-btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero reveal" ref={heroRef}>
        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <span className="lp-badge-dot" />
            <span>AI-Powered Learning</span>
          </div>

          <h1 className="lp-hero-headline">
            Master any video <br />
            <span className="text-gradient">in record time.</span>
          </h1>

          <p className="lp-hero-sub">
            Stop passively watching. Start actively learning. StudySpace syncs your notes to video timestamps and gives you an AI tutor that actually understands the context.
          </p>

          <div className="lp-hero-ctas">
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="lp-cta-main"
            >
              <FiPlay size={18} />
              {isLoggedIn ? "Go to Dashboard" : "Start Learning Free"}
            </Link>
          </div>

          <ul className="lp-highlights">
            {highlights.map((h, i) => (
              <li key={i} className="lp-highlight-item">
                <div className="lp-check-circle">
                  <FiCheck size={14} />
                </div>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features reveal">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Everything you need to <span className="text-gradient">focus</span></h2>
            <p className="lp-section-subtitle">A distraction-free environment built for deep work.</p>
          </div>

          <div className="lp-features-grid">
            {features.map((f, i) => (
              <div className="lp-feature-card" key={i}>
                <div className="lp-feature-icon-box">
                  <f.icon size={24} />
                </div>
                <h3 className="lp-feature-title">{f.number}. {f.title}</h3>
                <p className="lp-feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how reveal">
        <div className="lp-container">
          <div className="lp-how-grid">
            <div className="lp-how-left">
              <h2 className="lp-section-title">How it works</h2>
              <p className="lp-section-subtitle">
                Simple, powerful, and effective. No learning curve required.
              </p>
            </div>

            <div className="lp-how-right">
              {steps.map((s, i) => (
                <div className="lp-step-card" key={i}>
                  <div className="lp-step-number">{s.number}</div>
                  <div className="lp-step-content">
                    <h4 className="lp-step-title">{s.title}</h4>
                    <p className="lp-step-desc">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="lp-cta-strip reveal">
        <div className="lp-cta-content">
          <h2 className="lp-cta-title">Ready to upgrade your study flow?</h2>
          <p className="lp-cta-text">Join thousands of students learning smarter, not harder.</p>
          <Link
            to={isLoggedIn ? "/dashboard" : "/register"}
            className="lp-cta-button"
          >
            Get Started Now <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer reveal">
        <div className="lp-footer-inner">
          <div className="lp-brand">
            <span className="lp-brand-name">StudySpace</span>
          </div>
          <div className="lp-footer-links">
            <span>© 2026 StudySpace</span>
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;