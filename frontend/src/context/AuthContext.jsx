import { createContext, useCallback, useMemo, useState } from "react";
import { loginService } from "../services/auth.service.js";
import {
  clearSession,
  getStoredUser,
  getToken,
  isTokenExpired,
  saveSession,
} from "../helpers/storage.js";

export const AuthContext = createContext(null);

function restoreUser() {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    clearSession();
    return null;
  }
  return getStoredUser();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(restoreUser);

  const login = useCallback(async (credentials) => {
    const { token, user } = await loginService(credentials);
    saveSession(token, user);
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
