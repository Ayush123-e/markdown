import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Dashboard.css";
import { FiLogOut, FiPlus, FiVideo, FiTrash2, FiClock } from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUrl) return;
    setError(null);
    setCreating(true);

    try {
      const { data } = await api.post("/sessions", { videoUrl: newUrl });
      navigate(`/dashboard/session/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to parse YouTube URL or create workspace");
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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
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
            {sessions.length} Session{sessions.length !== 1 ? 's' : ''} Active
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
            <p>Paste a YouTube URL below to create a new AI-powered study workspace.</p>
          </div>

          <form className="db-create-bar" onSubmit={handleCreate}>
            <div className="db-input-wrapper">
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="db-create-input"
                required
              />
            </div>
            <button type="submit" className="db-create-btn" disabled={creating}>
              {creating ? (
                <div className="db-spinner" />
              ) : (
                <>
                  <FiPlus size={18} />
                  <span>Create Workspace</span>
                </>
              )}
            </button>
          </form>
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
            <p>Paste a video link above to start learning smarter.</p>
          </div>
        ) : (
          <div className="db-grid">
            {sessions.map((session) => (
              <Link key={session.id} to={`/dashboard/session/${session.id}`} className="db-card-link">
                <div className="db-card">
                  <div className="db-card-thumb">
                    <img
                      src={`https://img.youtube.com/vi/${new URL(session.videoUrl).searchParams.get("v")}/mqdefault.jpg`}
                      alt=""
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/320x180?text=Video'; }}
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
                    <h3 className="db-card-title" title={session.title}>{session.title}</h3>
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
    </div>
  );
};

export default Dashboard;