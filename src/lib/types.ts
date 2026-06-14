// Shared types used across the frontend (and mirrored loosely by the backend).

export type Provider = "openai" | "anthropic" | "gemini";

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

// The body the frontend sends to POST /api/chat.
export interface ChatRequest {
  provider: Provider;
  model: string;
  systemPrompt: string;
  messages: { role: Role; content: string }[];
  apiKey?: string;
}

// The normalized shape the backend returns on success.
export interface ChatResponse {
  text: string;
}

// Sensible default models per provider. Edit these freely.
export const DEFAULT_MODELS: Record<Provider, string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-haiku-4-5",
  gemini: "gemini-2.5-flash",
};

export const PROVIDER_LABELS: Record<Provider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
};

export const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful AI assistant. Answer clearly and kindly.";
