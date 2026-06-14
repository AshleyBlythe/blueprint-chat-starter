import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../lib/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClear: () => void;
}

// The main chat surface: message list, loading/error states, and the input.
export default function ChatWindow({
  messages,
  loading,
  error,
  onSend,
  onClear,
}: Props) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  function submit() {
    const text = draft.trim();
    if (!text || loading) return;
    onSend(text);
    setDraft("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends, Shift+Enter makes a new line.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <section className="chat-window">
      <div className="messages" ref={scrollRef}>
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            Start the conversation by sending a message below.
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}

        {loading && (
          <div className="bubble-row from-assistant">
            <div className="bubble">
              <div className="bubble-role">Assistant</div>
              <div className="bubble-content typing">Thinking…</div>
            </div>
          </div>
        )}

        {error && <div className="error-banner">{error}</div>}
      </div>

      <div className="composer">
        <textarea
          rows={2}
          value={draft}
          placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="composer-actions">
          <button
            className="ghost"
            onClick={onClear}
            disabled={messages.length === 0}
            title="Clear conversation history"
          >
            Clear chat
          </button>
          <button
            className="primary"
            onClick={submit}
            disabled={loading || draft.trim().length === 0}
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}
