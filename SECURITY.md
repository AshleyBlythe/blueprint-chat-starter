# Security Notes

This starter is **educational** and **not production hardened**. Please read
this before sharing or deploying anything built from it.

## Keys and secrets

- **Do not commit API keys.** Real keys must never be hard-coded in source or
  committed to git.
- Use `.env.example` as a template. Copy it to `.env` (which is git-ignored)
  for local use. **Never commit a real `.env`.**
- **Do not deploy publicly with exposed keys.** The BYOK ("bring your own
  key") flow in this app sends a key from the browser to the local backend for
  a single request. That is fine for local/personal testing, but it is **not**
  a safe pattern for a public deployment where untrusted users can reach it.

## Browser storage is not secure storage

- The optional "remember key in this browser" feature uses `localStorage`.
- `localStorage` is **not** secure storage. Any script running on the page can
  read it, and it persists in plain text on disk. Only use it on your own
  machine for personal testing, and clear it when you are done.

## Before you share or deploy: run TrustLayer

[TrustLayer](https://pypi.org/project/trustlayer/) can help catch common build
risks (committed secrets, obvious misconfigurations) before you publish.

```bash
python -m trustlayer scan .
```

Treat it as a helpful pre-flight check, not a guarantee. You are still
responsible for reviewing what you ship.

## Reporting

This is a community starter kit. If you find an issue, open an issue on the
repository. Do not include real secrets in bug reports.
