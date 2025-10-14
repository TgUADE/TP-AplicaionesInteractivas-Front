import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Verificar si hay un token en localStorage al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
    }
    setIsInitialized(true);
  }, []);

  // Función para hacer login y guardar el token
  const login = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    token,
    isInitialized,
    login,
    logout,
  };
};
