import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { FiPlay, FiClock, FiSearch, FiLogOut, FiVideo, FiPlus, FiHome, FiFolder, FiSettings, FiUser, FiMenu, FiX } from "react-icons/fi";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5001/api/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions");
    }
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
      const token = localStorage.getItem("token");
      const title = "New Study Session";
      const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

      const { data } = await axios.post(
        "http://localhost:5001/api/sessions",
        {
          title,
          videoUrl: newUrl,
          thumbnail,
          content: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/session/${data.id}`);
    } catch (error) {
      console.error("Failed to create session", error);
      alert("Failed to create session");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: active ? '#EEF2FF' : 'transparent',
        border: 'none',
        borderRadius: '10px',
        color: active ? '#4F46E5' : '#6B7280',
        fontSize: '14px',
        fontWeight: active ? '600' : '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.background = '#F9FAFB';
          e.target.style.color = '#111827';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.background = 'transparent';
          e.target.style.color = '#6B7280';
        }
      }}
    >
      <Icon size={20} />
      {sidebarOpen && <span>{label}</span>}
    </button>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '80px',
        background: 'white',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#4F46E5',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FiVideo size={20} style={{ color: 'white' }} />
            </div>
            {sidebarOpen && (
              <h1 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                StudySpace
              </h1>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: '#F9FAFB',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280'
            }}
          >
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <div style={{
          flex: 1,
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <NavItem icon={FiHome} label="Dashboard" active={true} />
          <NavItem icon={FiFolder} label={`Sessions (${sessions.length})`} active={false} />

          {/* Divider */}
          <div style={{ height: '1px', background: '#E5E7EB', margin: '16px 0' }}></div>

          <NavItem icon={FiSettings} label="Settings" active={false} />
        </div>

        {/* User Profile */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <div style={{
            padding: '12px',
            background: '#F9FAFB',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              background: '#4F46E5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <FiUser size={18} style={{ color: 'white' }} />
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  Student
                </p>
                <button
                  onClick={handleLogout}
                  style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
          {/* Welcome Section */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px',
              letterSpacing: '-0.02em'
            }}>
              Welcome back
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6B7280',
              fontWeight: '400',
              margin: 0
            }}>
              Continue learning or start a new study session
            </p>
          </div>

          {/* Create Session Card */}
          <div style={{
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '48px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <FiPlus size={20} style={{ color: '#4F46E5' }} />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                New Study Session
              </h3>
            </div>

            <form onSubmit={handleCreateSession}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Paste YouTube URL here..."
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '15px',
                      color: '#111827',
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.borderColor = '#4F46E5';
                    }}
                    onBlur={(e) => {
                      e.target.style.background = '#F9FAFB';
                      e.target.style.borderColor = '#E5E7EB';
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newUrl}
                  style={{
                    padding: '14px 28px',
                    background: newUrl ? '#4F46E5' : '#E5E7EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: newUrl ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (newUrl) e.target.style.background = '#4338CA';
                  }}
                  onMouseLeave={(e) => {
                    if (newUrl) e.target.style.background = '#4F46E5';
                  }}
                >
                  <FiPlay size={16} />
                  Start Session
                </button>
              </div>

              {/* Preview */}
              {newUrl && getYoutubeId(newUrl) && (
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#F9FAFB',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    fontWeight: '500',
                    marginBottom: '12px'
                  }}>
                    Preview
                  </p>
                  <div style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#000'
                  }}>
                    <ReactPlayer
                      url={newUrl}
                      width="100%"
                      height="100%"
                      controls={true}
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Sessions Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Your Sessions
              </h3>
              {sessions.length > 0 && (
                <span style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '500'
                }}>
                  {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
                </span>
              )}
            </div>

            {sessions.length === 0 ? (
              <div style={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '64px 32px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: '#F3F4F6',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <FiClock size={28} style={{ color: '#9CA3AF' }} />
                </div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px'
                }}>
                  No sessions yet
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: 0,
                  maxWidth: '360px',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  Create your first study session by pasting a YouTube URL above
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {sessions.map((session) => (
                  <Link
                    key={session.id}
                    to={`/session/${session.id}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      background: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}>
                      {/* Thumbnail */}
                      <div style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        background: '#F3F4F6',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={session.thumbnail || 'https://via.placeholder.com/320x180?text=No+Thumbnail'}
                          alt={session.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                          }}
                          className="play-overlay"
                        >
                          <div style={{
                            width: '56px',
                            height: '56px',
                            background: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <FiPlay size={24} style={{ color: '#4F46E5', marginLeft: '3px' }} />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '20px' }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#111827',
                          marginBottom: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          lineHeight: '1.4'
                        }}>
                          {session.title}
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          color: '#6B7280'
                        }}>
                          <FiClock size={14} />
                          <span>
                            {new Date(session.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .play-overlay:hover {
          opacity: 1 !important;
        }
        a:hover .play-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;