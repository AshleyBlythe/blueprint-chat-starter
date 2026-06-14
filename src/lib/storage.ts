// Tiny wrapper around the browser's localStorage.
//
// NOTE: localStorage is NOT secure storage. It is fine for chat history on
// your own machine, but do not treat it as a safe place for secrets.

import type { ChatMessage, Provider } from "./types";

const KEYS = {
  messages: "bpcs.messages",
  provider: "bpcs.provider",
  model: "bpcs.model",
  systemPrompt: "bpcs.systemPrompt",
  apiKey: "bpcs.apiKey", // only written when the user opts in
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota / private-mode errors — history is best-effort.
  }
}

// --- Messages ---------------------------------------------------------------

export function loadMessages(): ChatMessage[] {
  return read<ChatMessage[]>(KEYS.messages, []);
}

export function saveMessages(messages: ChatMessage[]): void {
  write(KEYS.messages, messages);
}

export function clearMessages(): void {
  localStorage.removeItem(KEYS.messages);
}

// --- Settings (provider / model / system prompt) ----------------------------

export function loadProvider(fallback: Provider): Provider {
  return read<Provider>(KEYS.provider, fallback);
}

export function saveProvider(provider: Provider): void {
  write(KEYS.provider, provider);
}

export function loadModel(fallback: string): string {
  return read<string>(KEYS.model, fallback);
}

export function saveModel(model: string): void {
  write(KEYS.model, model);
}

export function loadSystemPrompt(fallback: string): string {
  return read<string>(KEYS.systemPrompt, fallback);
}

export function saveSystemPrompt(prompt: string): void {
  write(KEYS.systemPrompt, prompt);
}

// --- API key (OPT-IN ONLY) --------------------------------------------------
// Storing an API key in the browser is convenient but insecure. Only persist
// it when the user explicitly opts in.

export function loadApiKey(): string {
  return read<string>(KEYS.apiKey, "");
}

export function saveApiKey(key: string): void {
  write(KEYS.apiKey, key);
}

export function clearApiKey(): void {
  localStorage.removeItem(KEYS.apiKey);
}
