import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/auth";

const AuthContext = createContext(null);

function readStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => readStorage("auth_user"));
  const [sessionToken, setSessionTokenState] = useState(
    () => localStorage.getItem("auth_token") || null
  );

  function setUser(data) {
    setUserState(data);
    if (data) localStorage.setItem("auth_user", JSON.stringify(data));
    else       localStorage.removeItem("auth_user");
  }

  function setSessionToken(token) {
    setSessionTokenState(token);
    if (token) localStorage.setItem("auth_token", token);
    else       localStorage.removeItem("auth_token");
  }

  // Call this anywhere a 401 is received to fully clear the session
  const clearSession = useCallback(() => {
    setUserState(null);
    setSessionTokenState(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  }, []);

  async function fetchMe() {
    const res = await authApi.me();
    if (res.success) {
      setUser(res.data);
    } else {
      // Any failure on /me means the session is invalid — clear everything
      clearSession();
    }
    return res;
  }

  async function logout() {
    await authApi.logout();
    clearSession();
  }

  return (
    <AuthContext.Provider value={{
      user, setUser, sessionToken, setSessionToken,
      fetchMe, logout, clearSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
