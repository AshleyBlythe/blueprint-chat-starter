// OpenAI provider adapter — uses the Chat Completions API.
// https://platform.openai.com/docs/api-reference/chat

export interface ProviderRequest {
  model: string;
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  apiKey: string;
}

export async function callOpenAI(req: ProviderRequest): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.apiKey}`,
    },
    body: JSON.stringify({
      model: req.model,
      messages: [
        { role: "system", content: req.systemPrompt },
        ...req.messages,
      ],
    }),
  });

  const data = (await res.json()) as any;

  if (!res.ok) {
    throw new Error(data?.error?.message || `OpenAI error (${res.status})`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error("OpenAI returned an unexpected response shape.");
  }
  return text;
}
