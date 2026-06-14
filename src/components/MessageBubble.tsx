import type { ChatMessage } from "../lib/types";

// A single chat message. User and assistant messages are styled differently.
export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`bubble-row ${isUser ? "from-user" : "from-assistant"}`}>
      <div className="bubble">
        <div className="bubble-role">{isUser ? "You" : "Assistant"}</div>
        <div className="bubble-content">{message.content}</div>
      </div>
    </div>
  );
}
