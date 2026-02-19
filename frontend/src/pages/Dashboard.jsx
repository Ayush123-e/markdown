import { useState, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { FiPlay, FiLogOut, FiVideo, FiPlus, FiTrash2 } from "react-icons/fi";
import "./Dashboard.css";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get("/sessions");
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions");
    }
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!newUrl) return;

    const videoId = getYoutubeId(newUrl);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    try {
      const title = newTitle.trim() || "New Study Session";
      const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

      const { data } = await api.post("/sessions", {
        title,
        videoUrl: newUrl,
        thumbnail,
        content: "",
      });

      setNewUrl("");
      setNewTitle("");
      navigate(`/dashboard/session/${data.id}`);
    } catch (error) {
      console.error("Failed to create session", error);
      alert("Failed to create session");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteSession = async (sessionId, sessionTitle, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Are you sure you want to delete "${sessionTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/sessions/${sessionId}`);
      fetchSessions();
    } catch (error) {
      console.error("Failed to delete session", error);
      alert("Failed to delete session");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="dashboard-navbar-left">
          <div className="dashboard-navbar-logo">
            <FiVideo size={20} style={{ color: 'white' }} />
          </div>
          <h1 className="dashboard-navbar-title">StudySpace</h1>
        </div>

        <div className="dashboard-navbar-right">
          <div className="dashboard-session-count">
            <span className="dashboard-session-count-text">Total Sessions:</span>
            <span className="dashboard-session-count-number">{sessions.length}</span>
          </div>
          <button onClick={handleLogout} className="dashboard-logout-btn">
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <h1 className="dashboard-welcome-title">Welcome Back</h1>
          <p className="dashboard-welcome-subtitle">
            Start a new study session or continue where you left off
          </p>
        </div>

        {/* New Session Card */}
        <div className="dashboard-new-session-card">
          <div className="dashboard-new-session-header">
            <FiPlus size={20} style={{ color: '#4F46E5' }} />
            <h3 className="dashboard-new-session-title">New Study Session</h3>
          </div>

          <form onSubmit={handleCreateSession}>
            <div className="dashboard-form-group">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Session name (optional)..."
                className="dashboard-title-input"
              />
            </div>

            <div className="dashboard-url-row">
              <div className="dashboard-url-input-wrapper">
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="dashboard-url-input"
                />
              </div>
              <button
                type="submit"
                disabled={!newUrl}
                className="dashboard-submit-btn"
              >
                <FiPlay size={16} />
                Start Session
              </button>
            </div>
          </form>
        </div>

        {/* Sessions Section */}
        <div className="dashboard-sessions-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">My Sessions</h2>
          </div>

          {sessions.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">
                <FiVideo size={32} />
              </div>
              <h3 className="dashboard-empty-title">No sessions yet</h3>
              <p className="dashboard-empty-subtitle">
                Create your first study session to get started!
              </p>
            </div>
          ) : (
            <div className="dashboard-sessions-grid">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  to={`/dashboard/session/${session.id}`}
                  className="dashboard-session-card-link"
                >
                  <div className="dashboard-session-card">
                    <div className="dashboard-session-thumbnail-wrapper">
                      <img
                        src={session.thumbnail}
                        alt={session.title}
                        className="dashboard-session-thumbnail"
                      />
                      <div className="dashboard-session-play-overlay">
                        <div className="dashboard-session-play-icon">
                          <FiPlay size={24} />
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, session.title, e)}
                        className="dashboard-session-delete-btn"
                        title="Delete session"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    <div className="dashboard-session-info">
                      <h3 className="dashboard-session-title">{session.title}</h3>
                      <p className="dashboard-session-date">
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;