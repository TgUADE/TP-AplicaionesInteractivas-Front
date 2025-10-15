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
    console.log("🔐 Login: Guardando token:", newToken ? "✓" : "✗");
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
    
    // Disparar evento después de que React actualice el estado
    // Usar setTimeout con 0ms pone el evento al final de la cola de eventos
    setTimeout(() => {
      console.log("📢 Disparando evento user_logged_in");
      window.dispatchEvent(new CustomEvent("user_logged_in", { detail: { token: newToken } }));
    }, 0);
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("temp_cart"); // Limpiar carrito temporal
    setToken(null);
    setIsLoggedIn(false);
    
    // Disparar evento para que otros componentes limpien sus estados
    window.dispatchEvent(new CustomEvent("user_logged_out"));
  };

  return {
    isLoggedIn,
    token,
    isInitialized,
    login,
    logout,
  };
};
