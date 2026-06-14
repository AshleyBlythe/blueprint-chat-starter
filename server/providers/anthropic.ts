// Anthropic provider adapter — uses the Messages API.
// https://docs.anthropic.com/en/api/messages

import type { ProviderRequest } from "./openai";

export async function callAnthropic(req: ProviderRequest): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": req.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: req.model,
      max_tokens: 1024,
      // Anthropic takes the system prompt as a top-level field.
      system: req.systemPrompt,
      messages: req.messages,
    }),
  });

  const data = (await res.json()) as any;

  if (!res.ok) {
    throw new Error(data?.error?.message || `Anthropic error (${res.status})`);
  }

  // Content is an array of blocks; concatenate the text blocks.
  const text = Array.isArray(data?.content)
    ? data.content
        .filter((b: any) => b?.type === "text")
        .map((b: any) => b.text)
        .join("")
    : undefined;

  if (typeof text !== "string" || text.length === 0) {
    throw new Error("Anthropic returned an unexpected response shape.");
  }
  return text;
}
