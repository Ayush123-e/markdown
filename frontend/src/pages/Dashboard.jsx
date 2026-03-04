import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";
import { FiLogOut, FiPlus, FiVideo, FiTrash2, FiClock, FiX, FiLink, FiTag } from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState(null);

  const titleInputRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  // Focus title input when modal opens
  useEffect(() => {
    if (modalOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 80);
    }
  }, [modalOpen]);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get("/sessions");
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:");
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const openModal = () => {
    setNewUrl("");
    setNewTitle("");
    setModalError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (creating) return;
    setModalOpen(false);
    setModalError(null);
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && modalOpen && !creating) closeModal();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [modalOpen, creating]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUrl || !newTitle.trim()) return;
    setModalError(null);
    setCreating(true);

    try {
      const { data } = await api.post("/sessions", {
        videoUrl: newUrl,
        title: newTitle.trim(),
      });
      navigate(`/dashboard/session/${data.id}`);
    } catch (err) {
      setModalError(
        err.response?.data?.message || "Failed to create workspace. Check the YouTube URL."
      );
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete session");
    }
  };

  // Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const getYouTubeId = (url) => {
    try {
      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([-\w]{11})/
      );
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  return (
    <div className="db-root">
      {/* ── TOP NAV ── */}
      <nav className="db-nav">
        <div className="db-nav-left">
          <div className="db-logo-mark">
            <FiVideo size={18} />
          </div>
          <span className="db-logo-name">StudySpace</span>
        </div>
        <div className="db-nav-right">
          <span className="db-session-count">
            {sessions.length} Session{sessions.length !== 1 ? "s" : ""} Active
          </span>
          <button onClick={handleLogout} className="db-logout">
            <FiLogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <header className="db-hero">
        <div className="db-hero-inner">
          <div className="db-hero-text">
            <h1>Ready to focus?</h1>
            <p>Create a new AI-powered study workspace from any YouTube video.</p>
          </div>

          <div className="db-hero-cta">
            <button className="db-create-btn" onClick={openModal}>
              <FiPlus size={18} />
              <span>New Workspace</span>
            </button>
          </div>
          {error && <div className="db-hero-error">{error}</div>}
        </div>
      </header>

      {/* ── MAIN CONTENT (SESSIONS) ── */}
      <main className="db-main">
        <div className="db-main-header">
          <h2>Recent Sessions</h2>
        </div>

        {loading ? (
          <div className="db-loading">Loading your workspaces...</div>
        ) : sessions.length === 0 ? (
          <div className="db-empty">
            <div className="db-empty-icon">
              <FiVideo size={48} />
            </div>
            <h3>No sessions yet</h3>
            <p>Click "New Workspace" above to start learning smarter.</p>
          </div>
        ) : (
          <div className="db-grid">
            {sessions.map((session) => (
              <Link
                key={session.id}
                to={`/dashboard/session/${session.id}`}
                className="db-card-link"
              >
                <div className="db-card">
                  <div className="db-card-thumb">
                    <img
                      src={
                        getYouTubeId(session.videoUrl)
                          ? `https://img.youtube.com/vi/${getYouTubeId(session.videoUrl)}/mqdefault.jpg`
                          : "https://via.placeholder.com/320x180?text=Video"
                      }
                      alt={session.title || "Video thumbnail"}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/320x180?text=Video";
                      }}
                    />
                    <div className="db-card-overlay">
                      <FiVideo className="db-play-icon" size={32} />
                    </div>
                    <button
                      className="db-card-delete"
                      onClick={(e) => handleDelete(e, session.id)}
                      title="Delete session"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <div className="db-card-info">
                    <h3 className="db-card-title" title={session.title}>
                      {session.title}
                    </h3>
                    <div className="db-card-meta">
                      <div className="db-meta-item">
                        <FiClock size={12} />
                        <span>{formatDate(session.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── CREATE SESSION MODAL ── */}
      {modalOpen && (
        <div className="db-modal-backdrop" onClick={handleBackdropClick}>
          <div className="db-modal">
            {/* Modal Header */}
            <div className="db-modal-header">
              <div className="db-modal-icon">
                <FiPlus size={20} />
              </div>
              <div>
                <h2 className="db-modal-title">New Study Workspace</h2>
                <p className="db-modal-subtitle">Give your session a name and paste a YouTube link</p>
              </div>
              <button
                className="db-modal-close"
                onClick={closeModal}
                disabled={creating}
                aria-label="Close"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form className="db-modal-form" onSubmit={handleCreate}>
              {/* Title Field */}
              <div className="db-field">
                <label className="db-field-label" htmlFor="session-title">
                  <FiTag size={13} />
                  Session Title
                </label>
                <input
                  id="session-title"
                  ref={titleInputRef}
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. DSA — Recursion Deep Dive"
                  className="db-field-input"
                  maxLength={80}
                  required
                  disabled={creating}
                />
                <span className="db-field-hint">{newTitle.length}/80 characters</span>
              </div>

              {/* URL Field */}
              <div className="db-field">
                <label className="db-field-label" htmlFor="session-url">
                  <FiLink size={13} />
                  YouTube URL
                </label>
                <input
                  id="session-url"
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="db-field-input"
                  required
                  disabled={creating}
                />
              </div>

              {/* Error */}
              {modalError && (
                <div className="db-modal-error">{modalError}</div>
              )}

              {/* Actions */}
              <div className="db-modal-actions">
                <button
                  type="button"
                  className="db-modal-cancel"
                  onClick={closeModal}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="db-modal-submit"
                  disabled={creating || !newTitle.trim() || !newUrl}
                >
                  {creating ? (
                    <>
                      <div className="db-spinner" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} />
                      <span>Create Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;