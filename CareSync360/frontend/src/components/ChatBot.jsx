import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, MessageSquare, X, Send, RotateCcw, Minus } from "lucide-react";
import "../styles/chatbot.css";

/* ── Groq API config ─────────────────────────────────────── */
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are CareSync AI, the intelligent health assistant for CareSync360 — a modern digital healthcare platform that connects patients with doctors.

Your role:
- Help users navigate the CareSync360 platform (booking, appointments, profiles, prescriptions, payments)
- Answer general healthcare and wellness questions in a clear, friendly, and professional tone
- Guide doctors on using the dashboard (availability, appointments, prescriptions)
- Guide patients on finding doctors, booking consultations, and managing their health records
- Answer FAQs about the platform

Platform features you know about:
- Patient portal: find doctors, book appointments, view prescriptions, upload/download medical reports, make payments
- Doctor portal: manage availability slots, accept/reject appointments, issue digital prescriptions, view patient reports
- Admin portal: create doctor accounts and profiles
- Appointment flow: Patient books → Doctor accepts → Patient pays → Consultation happens → Doctor issues prescription
- Payment: Handled after appointment acceptance (LKR currency)
- Consultation fee varies by doctor (set in their profile)

Rules:
- Be concise but thorough. Use bullet points for lists.
- Never fabricate medical diagnoses or give specific medical advice — always recommend consulting a real doctor for medical decisions.
- Keep responses focused on the platform or general health wellness.
- Be warm, professional, and encouraging.
- For urgent medical emergencies, always advise the user to call emergency services immediately.
- Respond in the same language the user writes in.`;

const SUGGESTIONS = [
  "How do I book an appointment?",
  "How does payment work?",
  "How do I issue a prescription?",
  "What doctors are available?",
];

/* ── Helpers ─────────────────────────────────────────────── */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderMarkdown(text) {
  // Very lightweight markdown: bold, bullet lists, line breaks
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^[-•]\s(.+)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

/* ── ChatBot Component ───────────────────────────────────── */
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  /* ── Auto-scroll ── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ── Focus input when opened ── */
  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  /* ── Open / close with animation ── */
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 280);
  };

  const handleToggle = () => {
    if (open) {
      handleClose();
    } else {
      setOpen(true);
    }
  };

  /* ── Clear chat ── */
  const handleClear = () => {
    setMessages([]);
  };

  /* ── Send message ── */
  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg = { role: "user", content: trimmed, time: new Date() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const history = [...messages, userMsg].map(({ role, content }) => ({
          role,
          content,
        }));

        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
            max_tokens: 512,
            temperature: 0.6,
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(
            err?.error?.message || `API error ${response.status}`,
          );
        }

        const data = await response.json();
        const reply =
          data.choices?.[0]?.message?.content ||
          "I'm sorry, I couldn't generate a response.";

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply, time: new Date() },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `I'm having trouble connecting right now. Please try again in a moment.\n\n_Error: ${err.message}_`,
            time: new Date(),
            isError: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, apiKey],
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── Floating Trigger ── */}
      <button
        type="button"
        className="cb-trigger"
        onClick={handleToggle}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
      >
        {open ? (
          <X size={22} strokeWidth={1.5} />
        ) : (
          <MessageSquare size={22} strokeWidth={1.5} />
        )}
        {!open && hasUnread && <span className="cb-badge">1</span>}
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className={`cb-window${closing ? " cb-closing" : ""}`}
          role="dialog"
          aria-label="CareSync AI chat"
        >
          {/* Header */}
          <div className="cb-header">
            <div className="cb-header-left">
              <div className="cb-avatar">
                <Bot size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="cb-header-title">
                  CareSync{" "}
                  <span style={{ color: "#0d9488", fontStyle: "italic" }}>
                    AI
                  </span>
                </p>
                <p className="cb-header-sub">
                  <span className="cb-online-dot" />
                  Health Assistant · Always available
                </p>
              </div>
            </div>
            <div className="cb-header-actions">
              <button
                type="button"
                className="cb-icon-btn"
                onClick={handleClear}
                title="Clear conversation"
              >
                <RotateCcw size={14} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="cb-icon-btn"
                onClick={handleClose}
                title="Close"
              >
                <Minus size={14} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="cb-messages">
            {/* Welcome card (shown when no messages yet) */}
            {messages.length === 0 && (
              <div className="cb-intro">
                <div className="cb-intro-icon">
                  <Bot size={22} strokeWidth={1.5} />
                </div>
                <h4>Hi, I'm CareSync AI</h4>
                <p>
                  Your personal health assistant. Ask me anything about booking
                  appointments, finding doctors, managing prescriptions, or
                  navigating the platform.
                </p>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`cb-msg cb-msg--${msg.role === "user" ? "user" : "bot"}`}
              >
                <div className="cb-msg-icon">
                  {msg.role === "user" ? (
                    <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>
                      You
                    </span>
                  ) : (
                    <Bot size={14} strokeWidth={1.5} />
                  )}
                </div>
                <div>
                  <div
                    className="cb-bubble"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                      __html: `<p>${renderMarkdown(msg.content)}</p>`,
                    }}
                  />
                  <p className="cb-msg-time">{formatTime(msg.time)}</p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="cb-typing">
                <div
                  className="cb-msg-icon"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(13,148,136,0.1)",
                    color: "#0d9488",
                    border: "1px solid rgba(13,148,136,0.2)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <Bot size={14} strokeWidth={1.5} />
                </div>
                <div className="cb-typing-bubble">
                  <span className="cb-typing-dot" />
                  <span className="cb-typing-dot" />
                  <span className="cb-typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts (only shown at start) */}
          {messages.length === 0 && (
            <div className="cb-suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="cb-suggestion-btn"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="cb-input-area" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="cb-input"
              rows={1}
              placeholder="Ask about appointments, doctors, prescriptions…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              type="submit"
              className="cb-send-btn"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={16} strokeWidth={1.5} />
            </button>
          </form>

          {/* Footer */}
          <p className="cb-footer">
            Powered by <strong>Groq · Llama 3</strong> · Not a substitute for
            professional medical advice
          </p>
        </div>
      )}
    </>
  );
}

export default ChatBot;
