// Minimal Express backend proxy for the BluePrint Chat Starter.
//
// Why a backend at all? So the browser never talks to AI providers directly.
// The frontend sends the user's API key here for a single request; this
// server forwards it to the provider and returns a normalized { text }.
//
// The key is NEVER stored on the server. It lives only in memory for the
// duration of the request.

import process from "node:process";
import express from "express";
import { callOpenAI, type ProviderRequest } from "./providers/openai";

// Load .env if present (optional). Node 20.12+ ships loadEnvFile built-in,
// so we avoid an extra dependency. Missing file is fine — keys are optional.
try {
  process.loadEnvFile();
} catch {
  // No .env file — that's expected. Use BYOK from the UI instead.
}

import { callAnthropic } from "./providers/anthropic";
import { callGemini } from "./providers/gemini";

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT) || 8787;

type Provider = "openai" | "anthropic" | "gemini";

// Optional server-side fallback keys (from .env). BYOK from the UI wins.
const FALLBACK_KEYS: Record<Provider, string | undefined> = {
  openai: process.env.OPENAI_API_KEY,
  anthropic: process.env.ANTHROPIC_API_KEY,
  gemini: process.env.GEMINI_API_KEY,
};

const HANDLERS: Record<Provider, (req: ProviderRequest) => Promise<string>> = {
  openai: callOpenAI,
  anthropic: callAnthropic,
  gemini: callGemini,
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { provider, model, systemPrompt, messages, apiKey } = req.body ?? {};

    // --- Validate input ------------------------------------------------------
    if (provider !== "openai" && provider !== "anthropic" && provider !== "gemini") {
      return res.status(400).json({ error: "Unknown or missing provider." });
    }
    if (typeof model !== "string" || model.trim() === "") {
      return res.status(400).json({ error: "Missing model name." });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Missing messages." });
    }

    const key =
      (typeof apiKey === "string" && apiKey.trim()) ||
      FALLBACK_KEYS[provider as Provider];

    if (!key) {
      return res.status(400).json({
        error:
          "No API key provided. Paste your key in the UI (BYOK) or set one in .env.",
      });
    }

    const text = await HANDLERS[provider as Provider]({
      model,
      systemPrompt:
        typeof systemPrompt === "string" ? systemPrompt : "",
      messages,
      apiKey: key,
    });

    return res.json({ text });
  } catch (err) {
    // Surface a useful message, but never echo the API key or internals.
    const message =
      err instanceof Error ? err.message : "Unexpected server error.";
    console.error("[chat error]", message);
    return res.status(502).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy listening on http://localhost:${PORT}`);
});
