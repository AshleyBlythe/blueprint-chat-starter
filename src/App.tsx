import { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ProviderSelector from "./components/ProviderSelector";
import SystemPromptEditor from "./components/SystemPromptEditor";
import ApiKeyBox from "./components/ApiKeyBox";
import {
  DEFAULT_MODELS,
  DEFAULT_SYSTEM_PROMPT,
  type ChatMessage,
  type ChatResponse,
  type Provider,
} from "./lib/types";
import {
  clearApiKey,
  clearMessages,
  loadApiKey,
  loadMessages,
  loadModel,
  loadProvider,
  loadSystemPrompt,
  saveApiKey,
  saveMessages,
  saveModel,
  saveProvider,
  saveSystemPrompt,
} from "./lib/storage";

// A small id helper for messages.
function newId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function App() {
  const [provider, setProvider] = useState<Provider>(() =>
    loadProvider("openai")
  );
  const [model, setModel] = useState<string>(() =>
    loadModel(DEFAULT_MODELS["openai"])
  );
  const [systemPrompt, setSystemPrompt] = useState<string>(() =>
    loadSystemPrompt(DEFAULT_SYSTEM_PROMPT)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages());

  const [apiKey, setApiKey] = useState<string>(() => loadApiKey());
  const [remember, setRemember] = useState<boolean>(() => loadApiKey() !== "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist settings + history whenever they change.
  useEffect(() => saveProvider(provider), [provider]);
  useEffect(() => saveModel(model), [model]);
  useEffect(() => saveSystemPrompt(systemPrompt), [systemPrompt]);
  useEffect(() => saveMessages(messages), [messages]);

  // When the provider changes, swap in that provider's default model.
  function handleProviderChange(next: Provider) {
    setProvider(next);
    setModel(DEFAULT_MODELS[next]);
  }

  // API key persistence is opt-in via the "remember" checkbox.
  function handleApiKeyChange(key: string) {
    setApiKey(key);
    if (remember) saveApiKey(key);
  }

  function handleRememberChange(next: boolean) {
    setRemember(next);
    if (next) saveApiKey(apiKey);
    else clearApiKey();
  }

  async function handleSend(text: string) {
    setError(null);

    const userMessage: ChatMessage = {
      id: newId(),
      role: "user",
      content: text,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          model,
          systemPrompt,
          apiKey: apiKey || undefined,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await res.json()) as ChatResponse & { error?: string };

      if (!res.ok || data.error) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "assistant", content: data.text },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    clearMessages();
    setError(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>BluePrint Chat Starter</h1>
        <p className="subtitle">
          A minimal, customizable AI chat starter. Educational use — bring your
          own key.
        </p>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <ProviderSelector
            provider={provider}
            model={model}
            onProviderChange={handleProviderChange}
            onModelChange={setModel}
          />
          <ApiKeyBox
            apiKey={apiKey}
            remember={remember}
            onApiKeyChange={handleApiKeyChange}
            onRememberChange={handleRememberChange}
          />
          <SystemPromptEditor value={systemPrompt} onChange={setSystemPrompt} />
        </aside>

        <main className="main">
          <ChatWindow
            messages={messages}
            loading={loading}
            error={error}
            onSend={handleSend}
            onClear={handleClear}
          />
        </main>
      </div>

      <footer className="app-footer">
        FLARE Collective / The BluePrint · starter kit · not a production
        companion platform
      </footer>
    </div>
  );
}
