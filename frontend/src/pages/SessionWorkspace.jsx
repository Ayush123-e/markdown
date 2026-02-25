import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ReactMarkdown from "react-markdown";
import "./SessionWorkspace.css";
import api from "../api";
import { FiSave, FiMessageSquare, FiArrowLeft, FiX, FiSend, FiVideo, FiEdit3, FiDownload } from "react-icons/fi";

const SessionWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const [session, setSession] = useState(null);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([{ role: "ai", text: "Hello! I'm your AI Study Assistant. Ask me anything about your studies." }]);
  const [input, setInput] = useState("");
  const [notification, setNotification] = useState({ text: "", type: "success" });
  const [playing, setPlaying] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await api.get(`/sessions/${id}`);
        setSession(data);
        setContent(data.content || "");
      } catch { console.error("Failed to fetch session"); }
    };
    fetchSession();
  }, [id]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showNotification = (text, type = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification({ text: "", type: "success" }), 2500);
  };

  const saveSession = async () => {
    setSaving(true);
    try {
      await api.put(`/sessions/${id}`, { title: session.title, content });
      showNotification("Session saved successfully!");
    } catch {
      showNotification("Error saving session", "error");
    } finally { setSaving(false); }
  };

  const downloadNotes = () => {
    if (!content || content.trim() === "") { showNotification("No notes to download", "error"); return; }
    const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${session?.title || 'Study Notes'}</title><style>body{font-family:-apple-system,sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;color:#333}h1{color:#E10600;border-bottom:3px solid #E10600;padding-bottom:10px}.metadata{color:#777;font-size:14px;margin-bottom:30px}</style></head><body><h1>${session?.title || 'Study Notes'}</h1><div class="metadata"><p>Downloaded: ${new Date().toLocaleString()}</p></div><div>${content}</div></body></html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = `${session?.title || "notes"}.html`;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
    showNotification("Notes downloaded!");
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isAiTyping) return;
    const userMsg = { role: "user", text: input };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput("");
    setIsAiTyping(true);

    try {
      const { data } = await api.post("/ai/chat", { message: input, history: messages });
      setMessages([...currentMessages, { role: "ai", text: data.text }]);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Sorry, I'm having trouble connecting.";
      setMessages([...currentMessages, { role: "ai", text: errMsg }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  if (!session) {
    return (
      <div className="sw-loading">
        <div className="sw-spinner" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="sw-root">
      {/* Header */}
      <header className="sw-header">
        <div className="sw-header-left">
          <button onClick={() => navigate("/dashboard")} className="sw-back">
            <FiArrowLeft size={16} /> Back
          </button>
          <div className="sw-header-divider" />
          <div className="sw-header-title">
            <FiVideo size={16} className="sw-header-title-icon" />
            <span>{session.title}</span>
          </div>
        </div>

        <div className="sw-header-right">
          <button
            onClick={() => setNotesOpen(!notesOpen)}
            className={`sw-btn ${notesOpen ? "sw-btn--active" : ""}`}
          >
            <FiEdit3 size={15} /> Notes
          </button>
          <button onClick={downloadNotes} className="sw-btn">
            <FiDownload size={15} /> Download
          </button>
          <button onClick={saveSession} disabled={saving} className="sw-btn sw-btn--primary">
            <FiSave size={15} /> {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="sw-body">
        {/* Video */}
        <div className={`sw-video-panel ${notesOpen ? "sw-video-panel--split" : ""}`}>
          <div className="sw-video-wrap">
            <ReactPlayer
              ref={playerRef}
              url={session.videoUrl}
              width="100%"
              height="100%"
              controls
              playing={playing}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              config={{ youtube: { playerVars: { showinfo: 1, autoplay: 1 } } }}
            />
          </div>
        </div>

        {/* Notes */}
        {notesOpen && (
          <div className="sw-notes-panel">
            <div className="sw-notes-header">
              <h3>Study Notes</h3>
            </div>
            <div className="sw-notes-editor">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Start taking notes..."
                style={{ height: "calc(100% - 42px)" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Chat Toggle Button */}
      {!chatOpen && (
        <button className="sw-chat-fab" onClick={() => setChatOpen(true)}>
          <FiMessageSquare size={22} />
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div className="sw-chat">
          <div className="sw-chat-header">
            <div className="sw-chat-header-left">
              <div className="sw-chat-avatar">⚡</div>
              <div>
                <strong>AI Tutor</strong>
                <span>Powered by Gemini</span>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="sw-chat-close">
              <FiX size={16} />
            </button>
          </div>

          <div className="sw-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`sw-msg sw-msg--${msg.role}`}>
                <div className="sw-msg-content">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isAiTyping && (
              <div className="sw-msg sw-msg--ai">
                <div className="sw-msg-content sw-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="sw-chat-input-wrap" onSubmit={handleChatSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="sw-chat-input"
            />
            <button type="submit" className="sw-chat-send">
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Notification */}
      {notification.text && (
        <div className={`sw-toast sw-toast--${notification.type}`}>
          {notification.text}
        </div>
      )}
    </div>
  );
};

export default SessionWorkspace;
