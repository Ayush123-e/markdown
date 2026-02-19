import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./SessionWorkspace.css";
import api from "../api";
import { FiSave, FiMessageSquare, FiArrowLeft, FiX, FiSend, FiVideo, FiEdit3, FiDownload } from "react-icons/fi";

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
      const { data } = await api.get(`/sessions/${id}`);
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
      await api.put(`/sessions/${id}`, { title: session.title, content });
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
      color: #FF6B6B;
      border-bottom: 3px solid #FF6B6B;
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



  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput("");

    try {
      const { data } = await api.post("/ai/chat", {
        message: input,
        history: messages
      });

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
            borderTopColor: '#FF6B6B',
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
    <div className="session-workspace">
      {/* Header */}
      <header className="session-header">
        <div className="session-header-left">
          <button
            onClick={() => navigate("/dashboard")}
            className="session-back-btn"
          >
            <FiArrowLeft size={16} /> Back
          </button>
          <div className="session-title-container">
            <FiVideo size={18} style={{ color: '#FF6B6B', flexShrink: 0 }} />
            <span className="session-title-text">
              {session.title}
            </span>
          </div>
        </div>

        <div className="session-header-right">
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className={`session-notes-toggle-btn ${notesOpen ? 'active' : 'inactive'}`}
          >
            <FiEdit3 size={16} /> Notes
          </button>

          <button
            onClick={downloadNotes}
            className="session-download-btn"
          >
            <FiDownload size={16} /> Download
          </button>

          <button
            onClick={saveSession}
            disabled={saving}
            className="session-save-btn"
          >
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="session-main-content">
        {/* Video Section - Large */}
        <div className={`session-video-section ${notesOpen ? 'notes-open' : ''}`}>
          <div className="session-video-container">
            <div className="session-video-player">
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
          <div className="session-notes-section">
            <div className="session-notes-container">
              <div className="session-notes-header">
                <h3 className="session-notes-title">
                  Study Notes
                </h3>
              </div>
              <div className="session-notes-editor">
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
        <div className="session-chat-window">
          {/* Chat Header */}
          <div className="session-chat-header">
            <div className="session-chat-header-left">
              <div className="session-chat-avatar">
                <span style={{ fontSize: '20px' }}>🤖</span>
              </div>
              <div className="session-chat-title-container">
                <h4>AI Tutor</h4>
                <p>Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="session-chat-close-btn"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="session-chat-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`session-chat-message ${msg.role}`}
              >
                <div className="session-chat-message-content">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="session-chat-input-container">
            <form onSubmit={handleChatSubmit} className="session-chat-input-form">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="session-chat-input"
              />
              <button type="submit" className="session-chat-send-btn">
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Chat Button - Bottom Right */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="session-chat-toggle-btn"
        >
          <FiMessageSquare size={24} style={{ color: 'white' }} />
        </button>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="session-notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default SessionWorkspace;
