// Google Gemini provider adapter — uses the Generative Language API.
// https://ai.google.dev/api/generate-content

import type { ProviderRequest } from "./openai";

export async function callGemini(req: ProviderRequest): Promise<string> {
  // Gemini uses "user" and "model" roles.
  const contents = req.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(req.model)}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": req.apiKey,
    },
    body: JSON.stringify({
      // The system prompt is passed via systemInstruction.
      systemInstruction: { parts: [{ text: req.systemPrompt }] },
      contents,
    }),
  });

  const data = (await res.json()) as any;

  if (!res.ok) {
    throw new Error(data?.error?.message || `Gemini error (${res.status})`);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p: any) => p?.text ?? "")
    .join("");

  if (typeof text !== "string" || text.length === 0) {
    throw new Error("Gemini returned an unexpected response shape.");
  }
  return text;
}
