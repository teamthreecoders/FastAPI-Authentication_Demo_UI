const BASE = "https://authentication-api-zeta.vercel.app";

// Relative URLs — Vite proxies /v1/* and /health → http://127.0.0.1:8000
const TOKEN_KEY = "auth_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

async function request(method, path, body) {
  const token = getToken();
  const headers = {};
  if (body)  headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, credentials: "include", headers };
  if (body) opts.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE}${path}`, opts);
    return await res.json();
  } catch {
    return { success: false, message: "Network error — check your connection." };
  }
}

export const authApi = {
  health:         ()                     => request("GET",    "/health"),
  signup:         (data)                 => request("POST",   "/v1/auth/signup", data),
  otpLogin:       (credential, password) =>
    request("POST", "/v1/auth/otp/login", { credential, password }),
  verify2fa:      (challenge_token, otp) =>
    request("POST", "/v1/auth/otp/login/2fa_verify", { challenge_token, otp }),
  me:             ()                     => request("POST",   "/v1/auth/me"),
  forgotPassword: (credential)           => request("POST",   "/v1/auth/forgot-password", { credential }),
  logout:         ()                     => request("DELETE", "/v1/auth/logout"),
};
