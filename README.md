# BluePrint Chat Starter

A bare-minimum AI chat app you can download, fork, run locally, import into
Replit, or hand to Lovable / Cursor / Claude Code to customize.

Built by **FLARE Collective / The BluePrint** as a learning starter kit.

---

## What this is

- A **simple, readable** AI chat app: Vite + React + TypeScript on the front
  end, a tiny Node/Express proxy on the back end.
- A starting point you are meant to **read, fork, and customize**.
- **Bring Your Own Key (BYOK):** you paste your own provider API key in the UI
  for local/personal testing.

## What this is *not*

- ❌ Not a production companion platform.
- ❌ Not Ignis, and not the AIB / continuity architecture.
- ❌ No auth, no database, no payments, no long-term memory, no companion
  identity system, no Cendri code.

It is intentionally small. Don't overbuild it — build *on* it.

---

## Quick start (local terminal)

You need **Node 20.12+** (Node 22 recommended).

```bash
npm install
npm run dev
```

This runs two things at once:

- the **frontend** (Vite) at <http://localhost:5173>
- the **backend proxy** (Express) at <http://localhost:8787>

Open <http://localhost:5173>, pick a provider, paste your API key, and send a
message.

> Building for production? `npm run build` type-checks and bundles the
> frontend. The backend can be run with `npm start`.

---

## How to use it in Replit

1. Create a new Repl and **import this repo** (or upload the folder).
2. In the shell, run `npm install`.
3. Run `npm run dev`.
4. Open the web preview. Replit forwards the Vite port for you.
5. Paste your API key in the UI to test.

(If Replit's preview only forwards one port, you can still use BYOK — the Vite
dev server proxies `/api` to the local backend.)

---

## How to hand it to Lovable / Cursor / Claude Code

This repo is deliberately small so an AI coding tool can understand all of it.
Good prompts to start with:

- "Read this repo and explain how a message goes from the input box to the AI
  provider and back."
- "Change the color theme to warm tones by editing the CSS variables in
  `src/styles.css`."
- "Add a fourth provider adapter in `server/providers/`."
- "Add a 'saved chats' feature using local storage."

Point the tool at `src/App.tsx` (frontend wiring) and `server/index.ts`
(backend routing) first.

---

## How BYOK works

1. You paste your API key into the **API key (BYOK)** field in the UI.
2. When you send a message, the frontend posts it to the **local backend**
   (`POST /api/chat`) along with the key.
3. The backend forwards the request to the chosen provider and returns a
   normalized `{ text }` response.
4. **The key is never stored on the server.** It only exists in memory for the
   duration of that one request.

You can optionally tick **"Remember key in this browser"** to keep it in
`localStorage` for convenience. This is **opt-in** and meant for local/personal
use only — see [SECURITY.md](./SECURITY.md).

### Why keys should not be hard-coded

Hard-coding a key in your source means it gets committed to git and shared with
anyone who sees the repo — that is how keys leak and run up bills. Keep keys in
the UI (BYOK) or in a git-ignored `.env`. Never commit real keys.

---

## ⚠️ Before you publish

This is a learning starter, **not** a hardened production app. Before you share
or deploy anything built from it:

- Read [SECURITY.md](./SECURITY.md).
- Make sure **no real keys or `.env` files** are committed.
- Understand that the BYOK pattern is safe for *local* use, but is **not** a
  safe pattern for a public deployment reachable by untrusted users.
- **Run TrustLayer** (see below).

### Run TrustLayer before publishing

[TrustLayer](https://pypi.org/project/trustlayer/) can help check for common
build risks (like committed secrets) before you share or deploy:

```bash
python -m trustlayer scan .
```

Treat it as a helpful pre-flight check, not a guarantee.

---

## Project structure (plain English)

```txt
blueprint-chat-starter/
  README.md            ← you are here
  LICENSE.md           ← FLARE Community Source License (draft)
  SECURITY.md          ← security do's and don'ts
  .env.example         ← template for optional local keys (copy to .env)
  .gitignore           ← keeps node_modules and .env out of git
  package.json         ← scripts and dependencies
  server/              ← the backend proxy (Node/Express)
    index.ts           ← receives /api/chat, validates, routes to a provider
    providers/         ← one small adapter per AI provider
      openai.ts
      anthropic.ts
      gemini.ts
  src/                 ← the frontend (Vite + React + TypeScript)
    App.tsx            ← wires the UI together and calls /api/chat
    main.tsx           ← React entry point
    styles.css         ← all styling + theme variables
    components/        ← the UI pieces
      ChatWindow.tsx       ← message list, input, loading/error states
      MessageBubble.tsx    ← a single message
      ProviderSelector.tsx ← provider + model picker
      SystemPromptEditor.tsx ← edit the system prompt
      ApiKeyBox.tsx        ← BYOK input
    lib/
      storage.ts       ← read/write conversation + settings in local storage
      types.ts         ← shared types + default models + default prompt
```

- **`src/`** is everything that runs in the browser.
- **`server/`** is the small proxy that talks to AI providers so the browser
  doesn't have to.
- **`lib/`** holds the non-UI helpers (storage, types).

---

## Providers & default models

Pick a provider in the UI and edit the model name freely. Defaults:

| Provider  | Default model               |
| --------- | --------------------------- |
| OpenAI    | `gpt-4o-mini`               |
| Anthropic | `claude-3-5-haiku-latest`   |
| Gemini    | `gemini-1.5-flash`          |

Defaults live in `src/lib/types.ts` (`DEFAULT_MODELS`) — change them there.

---

## The system prompt

The **system prompt** is the instruction sheet the AI reads before every reply.
The default is:

> You are a helpful AI assistant. Answer clearly and kindly.

Edit it in the UI, or change the default in `src/lib/types.ts`
(`DEFAULT_SYSTEM_PROMPT`).

---

## Conversation history

Messages are saved in your browser's `localStorage`, so they survive a refresh.
Use the **Clear chat** button to wipe them. `localStorage` is not secure
storage — see [SECURITY.md](./SECURITY.md).

---

## Customization ideas

- **Change colors:** edit the CSS variables at the top of `src/styles.css`.
- **Change the assistant name:** edit `MessageBubble.tsx` and the header in
  `App.tsx`.
- **Change the system prompt:** edit `DEFAULT_SYSTEM_PROMPT` in
  `src/lib/types.ts`.
- **Add a logo:** drop an image in `src/` (or `public/`) and render it in the
  header in `App.tsx`.
- **Add simple saved chats:** extend `src/lib/storage.ts` to keep a list of
  named conversations.
- **Add deployment later:** once you understand the BYOK trade-offs, you can
  host the frontend and backend separately. Read [SECURITY.md](./SECURITY.md)
  first.

---

## License

See [LICENSE.md](./LICENSE.md) — a draft **FLARE Community Source License** for
personal, educational, and noncommercial community use. Not legal advice.
