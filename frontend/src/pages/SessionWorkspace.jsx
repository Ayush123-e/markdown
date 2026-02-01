import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { FiSave, FiMessageSquare, FiArrowLeft, FiX, FiSend, FiVideo, FiEdit3, FiDownload, FiEdit2, FiCheck } from "react-icons/fi";

const SessionWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const quillRef = useRef(null);

  const [session, setSession] = useState(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([{ role: "ai", text: "Hello! I'm your AI Study Assistant. Ask me anything about your studies." }]);
  const [input, setInput] = useState("");
  const [notification, setNotification] = useState("");
  const [playing, setPlaying] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`http://localhost:5001/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSession(data);
      setContent(data.content || "");
    } catch (error) {
      console.error("Failed to fetch session");
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const saveSession = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/sessions/${id}`,
        { title: session.title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification("Session saved successfully!");
      setTimeout(() => setNotification(""), 2000);
    } catch (error) {
      setNotification("Error saving session");
      setTimeout(() => setNotification(""), 2000);
    } finally {
      setSaving(false);
    }
  };

  const downloadNotes = () => {
    if (!content || content.trim() === "") {
      setNotification("No notes to download");
      setTimeout(() => setNotification(""), 2000);
      return;
    }

    // Create HTML content with styling
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${session?.title || 'Study Notes'}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      color: #4F46E5;
      border-bottom: 3px solid #4F46E5;
      padding-bottom: 10px;
    }
    .metadata {
      color: #6B7280;
      font-size: 14px;
      margin-bottom: 30px;
    }
    .content {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <h1>${session?.title || 'Study Notes'}</h1>
  <div class="metadata">
    <p>Downloaded on: ${new Date().toLocaleString()}</p>
  </div>
  <div class="content">
    ${content}
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session?.title || 'notes'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification("Notes downloaded!");
    setTimeout(() => setNotification(""), 2000);
  };

  const handleUpdateTitle = async () => {
    if (!editedTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/sessions/${id}`,
        { title: editedTitle.trim(), content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSession({ ...session, title: editedTitle.trim() });
      setIsEditingTitle(false);
      setNotification("Title updated!");
      setTimeout(() => setNotification(""), 2000);
    } catch (error) {
      setNotification("Failed to update title");
      setTimeout(() => setNotification(""), 2000);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput("");

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5001/api/ai/chat",
        {
          message: input,
          history: messages
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...currentMessages, { role: "ai", text: data.text }]);
    } catch (error) {
      console.error("AI Error:", error);
      const errMsg = error.response?.data?.message || "Sorry, I'm having trouble connecting to my brain right now.";
      setMessages([
        ...currentMessages,
        { role: "ai", text: errMsg }
      ]);
    }
  };

  if (!session) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#FAFAFA'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-block',
            width: '48px',
            height: '48px',
            border: '4px solid #E5E7EB',
            borderTopColor: '#4F46E5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px', color: '#6B7280', fontSize: '14px' }}>Loading workspace...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#FAFAFA',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: '10px 16px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiArrowLeft size={16} /> Back
          </button>
          <div style={{
            padding: '8px 16px',
            background: '#F3F4F6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '400px'
          }}>
            <FiVideo size={16} style={{ color: '#4F46E5', flexShrink: 0 }} />
            {isEditingTitle ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateTitle();
                    }
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    background: 'white',
                    border: '1px solid #4F46E5',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827',
                    outline: 'none',
                    minWidth: '200px'
                  }}
                />
                <button
                  onClick={handleUpdateTitle}
                  style={{
                    padding: '4px',
                    background: '#10B981',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiCheck size={14} style={{ color: 'white' }} />
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  style={{
                    padding: '4px',
                    background: '#EF4444',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiX size={14} style={{ color: 'white' }} />
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827', flex: 1 }}>
                  {session.title}
                </span>
                <button
                  onClick={() => {
                    setEditedTitle(session.title);
                    setIsEditingTitle(true);
                  }}
                  style={{
                    padding: '4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#6B7280'
                  }}
                  title="Edit session name"
                >
                  <FiEdit2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            style={{
              padding: '10px 16px',
              background: notesOpen ? '#4F46E5' : 'white',
              border: notesOpen ? '1px solid #4F46E5' : '1px solid #E5E7EB',
              borderRadius: '8px',
              color: notesOpen ? 'white' : '#6B7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiEdit3 size={16} /> Notes
          </button>

          <button
            onClick={downloadNotes}
            style={{
              padding: '10px 16px',
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              color: '#6B7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiDownload size={16} /> Download
          </button>

          <button
            onClick={saveSession}
            disabled={saving}
            style={{
              padding: '10px 20px',
              background: '#4F46E5',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        padding: '20px',
        gap: '20px'
      }}>
        {/* Video Section - Large */}
        <div style={{
          flex: notesOpen ? '0 0 65%' : '1',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ flex: 1, background: '#000', position: 'relative' }}>
              <ReactPlayer
                ref={playerRef}
                url={session.videoUrl}
                width="100%"
                height="100%"
                controls
                playing={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                config={{
                  youtube: { playerVars: { showinfo: 1, autoplay: 1 } }
                }}
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {notesOpen && (
          <div style={{
            flex: '0 0 35%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              overflow: 'hidden',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E5E7EB',
                background: '#FAFAFA'
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Study Notes
                </h3>
              </div>
              <div style={{ flex: 1, overflow: 'hidden', padding: '16px' }}>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="Start taking notes while watching the video..."
                  style={{ height: 'calc(100% - 42px)' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat - Bottom Right Floating */}
      {chatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          left: 'auto',
          width: '380px',
          height: '500px',
          background: 'white',
          border: '1px solid #E5E7EB',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          overflow: 'hidden'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#4F46E5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'white',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '20px' }}>🤖</span>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: 0 }}>
                  AI Tutor
                </h4>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                  Powered by Gemini
                </p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '6px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#FAFAFA'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? '#4F46E5' : 'white',
                  color: msg.role === 'user' ? 'white' : '#111827',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  border: msg.role === 'user' ? 'none' : '1px solid #E5E7EB'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleChatSubmit} style={{
            padding: '16px',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            gap: '8px',
            background: 'white'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '10px 14px',
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                color: '#111827'
              }}
            />
            <button type="submit" style={{
              padding: '10px 16px',
              background: '#4F46E5',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}

      {/* AI Chat Button - Bottom Right */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            left: 'auto',
            width: '56px',
            height: '56px',
            background: '#4F46E5',
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 12px 32px rgba(79, 70, 229, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.4)';
          }}
        >
          <FiMessageSquare size={24} style={{ color: 'white' }} />
        </button>
      )}

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '14px 24px',
          background: '#111827',
          color: 'white',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FiClock size={16} /> {notification}
        </div>
      )}
    </div>
  );
};

export default SessionWorkspace;
