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

  // actualiza los datos del usuario guardados en el navegador (por ejemplo despues de editar su perfil)
  const updateUser = useCallback((cambios) => {
    setUser((actual) => {
      const nuevo = { ...actual, ...cambios };
      saveSession(getToken(), nuevo);
      return nuevo;
    });
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, updateUser }),
    [user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
