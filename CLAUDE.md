# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (proxies /v1/* and /health to :8000)
npm run build    # production build — run this to verify no compile errors
npm run lint     # ESLint check
npm run preview  # serve the dist/ build locally
```

No test suite exists in this project.

## Architecture

**Stack:** React 19 + Vite 8 + Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed). CSS entry point is `src/App.css` which starts with `@import "tailwindcss"`.

**Backend:** FastAPI at `http://127.0.0.1:8000`. All API calls use relative URLs (`/v1/...`); Vite proxies them to the backend. The proxy config is in `vite.config.js` — this is critical for cookies to work (same-origin). Auth uses `Authorization: Bearer <token>` header read from `localStorage["auth_token"]`.

**Auth flow:**
1. Login (`POST /v1/auth/otp/login`) → returns `data.token` (direct) or `data.challenge_token` (2FA)
2. If 2FA: OTP verify (`POST /v1/auth/otp/login/2fa_verify`) → returns `data.token`
3. Token stored in `localStorage["auth_token"]` and React state via `AuthContext.setSessionToken()`
4. Every `authApi` request automatically reads the token and sends `Authorization: Bearer <token>`
5. Any failed `/me` call triggers `clearSession()` which wipes both state and localStorage

**`AuthContext` (`src/context/AuthContext.jsx`)** — single source of truth for auth state. Exposes `user`, `sessionToken`, `fetchMe`, `logout`, `clearSession`. `fetchMe()` calls `/me` on every protected page mount; on any failure it calls `clearSession()` which triggers route guards to redirect to `/`.

**Route protection** (`src/App.jsx` — `AppShell`)  — `authed = !!(user || sessionToken)`. Protected routes (`/dashboard`, `/my-profile`) redirect to `/` when not authed. `/api-docs` and `/api-playground` are public. Login/signup/forgot-password have no routes — they are modals opened from the navbar.

**Modal system** — Login, SignUp, and ForgotPassword are not pages; they are form components rendered inside `<Modal>` controlled by `modal` state in `AppShell`. The modal state is `null | "login" | "signup" | "forgot"`.

**API response shape** — all responses follow `{ msg, success, code, error, data }`. Use `apiMsg(res, fallback)` from `src/utils/apiHelpers.js` to extract the message. Use `fieldErrors(res)` to get a `{ fieldName: errorMsg }` map from validation errors in `res.error.details`.

**Toast notifications** — `useToast()` from `src/context/ToastContext.jsx`. Call `addToast(message, "success" | "error")`. Toasts slide in from the right and auto-dismiss.

**API docs / playground shared data** — endpoint definitions, password rules, server list, and shared UI components (MethodBadge, CodeBlock, Sidebar, GitHubBtn) live in `src/pages/apiData.jsx` and are imported by both `ApiDocs.jsx` and `ApiPlayground.jsx`.

## Design tokens

Dark navy theme. Use these exact values for consistency:
- Background: `#020817` · Cards: `#0c1929` · Deep inputs: `#050c18`
- Borders: `#1e3a58` · Subtle borders: `#132436`
- Primary action: `bg-green-500 hover:bg-green-600` with `shadow-green-500/20`
- Input focus: `.input-green` CSS class (defined in `App.css`) — adds green border + glow
- Text: `text-slate-100` (primary) · `text-slate-400` (muted) · `text-slate-500` (faint)
- Animations: `.fade-in-up`, `.toast-enter`, `.toast-exit`, `.spinner` — all in `App.css`

## Key config to update

- `src/pages/apiData.jsx` line 5: `REPO_URL` — replace with the real GitHub repository URL
- `vite.config.js` proxy targets: change `http://127.0.0.1:8000` if backend runs on a different port
