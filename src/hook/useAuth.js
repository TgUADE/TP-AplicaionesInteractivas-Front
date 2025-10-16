import { useState, useEffect } from "react";

const parseJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    // Handle base64url encoding in JWTs
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded)) || {};
  } catch {
    return {};
  }
};

const getTokenExp = (jwt) => {
  try {
    const { exp } = parseJwt(jwt) || {};
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
};
const isExpired = (jwt) => {
  const exp = getTokenExp(jwt);
  return exp ? Date.now() >= exp * 1000 : false;
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const loadUserAndSetAdmin = async (jwt) => {
    try {
      setIsAuthLoading(true);
      const { sub } = parseJwt(jwt) || {};
      if (!sub) {
        setIsAdmin(false);
        localStorage.setItem("isAdmin", "false");
        return;
      }

      // Use relative path to go through Vite proxy and avoid CORS
      const res = await fetch(`/api/users/${sub}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const user = await res.json();

      const hasAdmin =
        user.isAdmin === true ||
        user.role === "ADMIN" ||
        (Array.isArray(user.authorities) &&
          user.authorities.includes("ROLE_ADMIN")) ||
        (Array.isArray(user.roles) && user.roles.includes("ADMIN"));
      setIsAdmin(!!hasAdmin);
      localStorage.setItem("isAdmin", hasAdmin ? "true" : "false");
    } catch {
      setIsAdmin(false);
      localStorage.setItem("isAdmin", "false");
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Verificar si hay un token en localStorage al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      if (isExpired(savedToken)) {
        logout();
        setIsInitialized(true);
        return;
      }
      setToken(savedToken);
      setIsLoggedIn(true);
      loadUserAndSetAdmin(savedToken).finally(() => {
        setIsInitialized(true);
      });
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Función para hacer login y guardar el token
  const login = async (newToken) => {
    console.log("🔐 Login: Guardando token:", newToken ? "✓" : "✗");
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
    if (isExpired(newToken)) {
      logout();
      setIsInitialized(true);
      return;
    }
    await loadUserAndSetAdmin(newToken);
    setIsInitialized(true);
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("temp_cart"); // Limpiar carrito temporal
    localStorage.removeItem("isAdmin");
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsAuthLoading(false);
  };

  return {
    isLoggedIn,
    token,
    isAdmin,
    isAuthLoading,
    isInitialized,
    login,
    logout,
  };
};
