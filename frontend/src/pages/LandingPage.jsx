import { Link, useNavigate } from "react-router-dom";
import { FiVideo, FiBook, FiZap, FiArrowRight, FiPlay } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import "./LandingPage.css";

const testimonials = [
  { text: "I used to drown in video tutorials. Now I actually remember what I watch. It's like a second brain.", author: "Alex Chen", role: "CS Student" },
  { text: "The AI tutor explains things better than my actual professor. Seriously a game changer for my exams.", author: "Sarah Miller", role: "Med Student" },
  { text: "Being able to jump to the exact moment in a video from my notes is a feature I didn't know I needed.", author: "James Wilson", role: "Developer" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quote] = useState(() => testimonials[Math.floor(Math.random() * testimonials.length)]);
  const revealRefs = useRef([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in-view"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: FiVideo, num: "01", title: "Video-Integrated Learning", desc: "Drop in any YouTube link. Your notes sync to the timestamp. Rewind, replay, annotate — the video becomes your textbook." },
    { icon: FiBook, num: "02", title: "Notes That Actually Work", desc: "Rich text, headers, lists, links. Save as a file, share it, or come back later. Your notes belong to you." },
    { icon: FiZap, num: "03", title: "Ask Anything, Anytime", desc: "Stuck on a concept? The AI tutor is right there beside the video. Ask in plain English. Get answers that make sense." },
  ];

  const steps = [
    { num: "01", title: "Paste a YouTube link", desc: "Any educational video. Drop the URL and you're in." },
    { num: "02", title: "Watch and write", desc: "Notes panel sits beside the video. No alt-tabbing, no losing your place." },
    { num: "03", title: "Ask when you're stuck", desc: "The AI tutor reads the context. You get a real answer, not a search result." },
  ];

  return (
    <div className="lp">
      {/* ── NAV ── */}
      <nav className={`lp-nav${scrolled ? " lp-nav--pinned" : ""}`}>
        <div className="lp-nav-inner">
          <div className="lp-logo">
            <div className="lp-logo-mark">
              <FiVideo size={18} />
            </div>
            <span className="lp-logo-name">StudySpace</span>
          </div>

          <div className="lp-nav-links">
            <a href="#features" className="lp-navlink">Features</a>
            <a href="#how" className="lp-navlink">How it works</a>
          </div>

          <div className="lp-nav-actions">
            {isLoggedIn ? (
              <button className="lp-btn-ghost" onClick={() => navigate("/dashboard")}>Dashboard <FiArrowRight size={14} /></button>
            ) : (
              <>
                <Link to="/login" className="lp-navlink">Sign In</Link>
                <Link to="/register" className="lp-btn-sharp">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-text reveal">
          <div className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            AI-Powered Study Platform
          </div>
          <h1 className="lp-hero-headline">
            Master any<br />
            video in<br />
            <em>record time.</em>
          </h1>
          <p className="lp-hero-sub">
            Stop passively watching. Start actively learning. StudySpace syncs your notes to video timestamps and gives you an AI tutor that actually understands the context.
          </p>
          <div className="lp-hero-ctas">
            <Link to={isLoggedIn ? "/dashboard" : "/register"} className="lp-cta-primary">
              <FiPlay size={16} />
              {isLoggedIn ? "Go to Dashboard" : "Start Learning Free"}
            </Link>
            <a href="#how" className="lp-cta-ghost">See how it works</a>
          </div>
          <div className="lp-hero-tags">
            {["Timestamp-synced notes", "AI tutor", "Download notes", "No limits"].map((t) => (
              <span key={t} className="lp-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="lp-hero-visual reveal">
          <div className="lp-hero-orb" />
          <div className="lp-hero-card lp-hc-1">
            <span className="lp-hc-icon"><FiVideo size={20} /></span>
            <span>Video synced</span>
          </div>
          <div className="lp-hero-card lp-hc-2">
            <span className="lp-hc-icon lp-hc-ai">⚡</span>
            <span>AI Tutor ready</span>
          </div>
          <div className="lp-hero-bignum">E</div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="lp-marquee-wrap">
        <div className="lp-marquee-track">
          {[...Array(3)].map((_, ri) => (
            <div className="lp-marquee-set" key={ri}>
              <span>2,000+ Students</span><span className="lp-dot">◆</span>
              <span>10,000+ Sessions</span><span className="lp-dot">◆</span>
              <span>AI-Powered</span><span className="lp-dot">◆</span>
              <span>Always Free</span><span className="lp-dot">◆</span>
              <span>Gemini AI</span><span className="lp-dot">◆</span>
              <span>Timestamp Notes</span><span className="lp-dot">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="lp-features" id="features">
        <div className="lp-features-inner">
          <div className="lp-features-header reveal">
            <span className="lp-section-label">What you get</span>
            <h2 className="lp-section-title">Everything you need<br />to actually <span className="lp-red">focus</span></h2>
          </div>

          <div className="lp-features-magazine reveal">
            {/* Big feature */}
            {(() => {
              const MainIcon = features[0].icon; return (
                <div className="lp-feat-main lp-feat-card">
                  <div className="lp-feat-num">{features[0].num}</div>
                  <div className="lp-feat-icon"><MainIcon size={32} /></div>
                  <h3 className="lp-feat-title">{features[0].title}</h3>
                  <p className="lp-feat-desc">{features[0].desc}</p>
                </div>
              );
            })()}
            {/* Side features */}
            <div className="lp-feat-side">
              {features.slice(1).map((f) => {
                const SideIcon = f.icon;
                return (
                  <div className="lp-feat-card lp-feat-small" key={f.num}>
                    <div className="lp-feat-num">{f.num}</div>
                    <div className="lp-feat-icon"><SideIcon size={24} /></div>
                    <h3 className="lp-feat-title">{f.title}</h3>
                    <p className="lp-feat-desc">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-how" id="how">
        <div className="lp-how-inner">
          <div className="lp-how-header reveal">
            <span className="lp-section-label">Process</span>
            <h2 className="lp-section-title">Three steps.<br />Zero confusion.</h2>
          </div>
          <div className="lp-timeline reveal">
            <div className="lp-timeline-line" />
            {steps.map((s, i) => (
              <div className="lp-timeline-node" key={i}>
                <div className="lp-timeline-dot">
                  <span>{s.num}</span>
                </div>
                <div className="lp-timeline-content">
                  <h4 className="lp-timeline-title">{s.title}</h4>
                  <p className="lp-timeline-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="lp-quote reveal">
        <div className="lp-quote-inner">
          <div className="lp-quote-mark">"</div>
          <blockquote className="lp-quote-text">{quote.text}</blockquote>
          <div className="lp-quote-author">
            <span className="lp-quote-neon" />
            <strong>{quote.author}</strong>
            <span className="lp-quote-role">{quote.role}</span>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta reveal">
        <div className="lp-cta-inner">
          <h2 className="lp-cta-headline">Ready to upgrade<br />your study flow?</h2>
          <p className="lp-cta-sub">Join thousands of students learning smarter, not harder.</p>
          <Link to={isLoggedIn ? "/dashboard" : "/register"} className="lp-cta-btn">
            Get Started Now <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-brand">
            <span className="lp-logo-name">StudySpace</span>
            <p>Learn smarter. Remember more.</p>
          </div>
          <div className="lp-footer-right">
            <span>© 2026 StudySpace</span>
            <span className="lp-footer-sep">·</span>
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;