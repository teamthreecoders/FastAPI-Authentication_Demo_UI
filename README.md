# AuthDemo — Full-Stack Authentication Platform

A complete authentication system built with **React 19 + Vite** on the frontend and **FastAPI (Python)** on the backend. Features OTP login, two-factor authentication, password recovery, a live API playground, and full API documentation — all in a modern dark-navy UI.

> 🔧 **Frontend** — this repository  
> 🐍 **Backend API** — `https://authentication-five-indol.vercel.app`

---

## Features

| Feature | Description |
|---|---|
| 🔐 Secure Login | Bearer token auth via `Authorization` header — auto-sent on every request |
| 📩 Two-Factor Auth (2FA) | OTP delivered to email; 15-minute expiry window |
| 🔑 Password Recovery | Time-limited reset link sent to registered email |
| 👤 Profile Management | View full user profile fetched from `/v1/auth/me` |
| ⚡ API Playground | Live request sender — fill forms, hit Send, see syntax-highlighted JSON + cURL |
| 📋 API Documentation | Complete endpoint reference with field tables, examples, error codes |
| 📱 Mobile Responsive | Hamburger nav, bottom-sheet modals, responsive grids throughout |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` — no config file) |
| Routing | React Router v7 |
| Backend | FastAPI (Python) — deployed on Vercel |
| Auth mechanism | Bearer token (`Authorization: Bearer <token>` header) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- FastAPI backend running on `http://127.0.0.1:8000` (local dev)

### Install & run

```bash
# Clone and install
npm install

# Start dev server (proxies /v1/* → :8000)
npm run dev
```

Open `http://localhost:5173` in your browser.

### Other commands

```bash
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Serve the dist/ build locally
```

---

## Project Structure

```
src/
├── api/
│   └── auth.js             # All API calls — reads token from localStorage, sends as Bearer header
├── components/
│   ├── Modal.jsx            # Bottom-sheet on mobile, centered popup on desktop
│   ├── PasswordInput.jsx    # Password field with strength indicator
│   └── ApiResponse.jsx      # JSON response display
├── context/
│   ├── AuthContext.jsx      # Session state — user, token, fetchMe, logout, clearSession
│   └── ToastContext.jsx     # Slide-in toast notifications
├── pages/
│   ├── Home.jsx             # Landing page with author card + feature grid
│   ├── Login.jsx            # Login modal form (email / phone / user ID)
│   ├── SignUp.jsx           # Registration modal form
│   ├── ForgotPassword.jsx   # Forgot password modal form
│   ├── OtpVerify.jsx        # 2FA OTP entry page
│   ├── Dashboard.jsx        # Protected dashboard with dummy stats
│   ├── MyProfile.jsx        # Protected user profile from /me
│   ├── ApiDocs.jsx          # Full API reference documentation
│   ├── ApiPlayground.jsx    # Live API playground with cURL builder
│   └── apiData.jsx          # Shared endpoint data + UI components (Sidebar, MethodBadge…)
├── utils/
│   └── apiHelpers.js        # apiMsg(), fieldErrors(), isTokenError()
├── App.jsx                  # Router, nav (hamburger on mobile), modal system, footer
└── App.css                  # Tailwind import + custom animations (fade-in-up, toast, spinner…)
```

---

## Auth Flow

```
1. Login   →  POST /v1/auth/otp/login
              ├── 2FA off → data.token  →  store in localStorage + state  →  /dashboard
              └── 2FA on  → data.challenge_token  →  /verify-otp

2. Verify  →  POST /v1/auth/otp/login/2fa_verify
              └── data.token  →  store  →  /dashboard

3. Session →  Every request reads localStorage["auth_token"]
              and sends  Authorization: Bearer <token>

4. Expiry  →  Any failed /me call triggers clearSession()
              which wipes state + localStorage  →  redirect to /
```

---

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home / landing page |
| `/dashboard` | Auth required | Dashboard with live stats |
| `/my-profile` | Auth required | User profile from `/me` |
| `/verify-otp` | Public | 2FA OTP entry |
| `/api-docs` | Public | API reference documentation |
| `/api-playground` | Public | Live API playground |

> Login, Sign Up, and Forgot Password are **modal popups**, not separate routes.

---

## Vite Proxy

In development, all `/v1/*` and `/health` requests are proxied to the backend so cookies and auth headers work on the same origin:

```js
// vite.config.js
proxy: {
  '/v1':    { target: 'http://127.0.0.1:8000', changeOrigin: true },
  '/health':{ target: 'http://127.0.0.1:8000', changeOrigin: true },
}
```

To switch to the production backend, change the proxy target or update `SERVERS` in `src/pages/apiData.jsx`.

---

## Personalisation

Update these placeholders before deploying:

| File | Variable | What to set |
|---|---|---|
| `src/pages/Home.jsx` | `AUTHOR.name` | Your name |
| `src/pages/Home.jsx` | `AUTHOR.linkedin` | Your LinkedIn URL |
| `src/pages/Home.jsx` | `AUTHOR.github` | Your GitHub URL |
| `src/pages/Home.jsx` | `AUTHOR.initials` | Your initials (2 letters) |
| `src/pages/apiData.jsx` | `REPO_URL` | Backend GitHub repo URL |

---

## API Reference

The backend exposes these endpoints — all documented at `/api-docs`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/v1/auth/signup` | Register new user |
| `POST` | `/v1/auth/otp/login` | Login (returns token or challenge) |
| `POST` | `/v1/auth/otp/login/2fa_verify` | Complete 2FA with OTP |
| `POST` | `/v1/auth/forgot-password` | Send password reset email |
| `POST` | `/v1/auth/me` | Get authenticated user profile |
| `DELETE` | `/v1/auth/logout` | Log out |

---

## Design System

- **Background:** `#020817` (dark navy)
- **Cards:** `#0c1929` with `#1e3a58` borders
- **Primary action:** `bg-green-500` with green glow shadow
- **Font:** Inter (Google Fonts)
- **Animations:** `fade-in-up`, `toast-enter/exit`, `spinner`, `modal-enter` — all in `src/App.css`

---

*Frontend built with [Claude Code](https://claude.ai/code) · Backend powered by FastAPI*
