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

  // Initialize isAdmin from localStorage if available
  const [isAdmin, setIsAdmin] = useState(() => {
    const savedIsAdmin = localStorage.getItem("isAdmin");
    return savedIsAdmin === "true";
  });
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Para login/logout en progreso

  const loadUserAndSetAdmin = async (jwt) => {
    try {
      setIsAuthLoading(true);
      const { sub } = parseJwt(jwt) || {};
      if (!sub) {
        setIsAdmin(false);
        localStorage.setItem("isAdmin", "false");
        return;
      }

      // Extract admin info directly from JWT to avoid duplicate HTTP calls
      const payload = parseJwt(jwt) || {};
      const authorities = payload.authorities || payload.roles || [];
      const role = payload.role || payload.scope || "";
      
      const hasAdmin =
        payload.isAdmin === true ||
        role === "ADMIN" ||
        (typeof role === "string" && role.includes("ADMIN")) ||
        (Array.isArray(authorities) && authorities.includes("ROLE_ADMIN")) ||
        (Array.isArray(authorities) && authorities.includes("ADMIN"));
        
      // Si JWT no contiene info de admin, mantener valor actual de localStorage como fallback
      if (!hasAdmin && (role === "" || role === undefined) && authorities.length === 0) {
        const savedIsAdmin = localStorage.getItem("isAdmin") === "true";
        setIsAdmin(savedIsAdmin);
        // No actualizar localStorage si JWT no tiene info
      } else {
        setIsAdmin(!!hasAdmin);
        localStorage.setItem("isAdmin", hasAdmin ? "true" : "false");
      }
    } catch (error) {
      console.error("❌ Error parsing JWT for admin status:", error);
      // No resetear isAdmin en caso de error, mantener estado actual
      const savedIsAdmin = localStorage.getItem("isAdmin") === "true";
      setIsAdmin(savedIsAdmin);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Listener para sincronizar admin status desde useUserProfile
  useEffect(() => {
    const handleProfileLoaded = (event) => {
      const { isAdmin: profileIsAdmin, role, profileData } = event.detail || {};
      console.log("📡 Profile loaded event received - isAdmin:", profileIsAdmin, "role:", role);
      
      if (typeof profileIsAdmin === "boolean") {
        console.log("🔄 Syncing admin status from profile:", profileIsAdmin ? "✓ ADMIN" : "✗ USER");
        setIsAdmin(profileIsAdmin);
        localStorage.setItem("isAdmin", profileIsAdmin ? "true" : "false");
        
        // Force re-render para que RequireAdmin vea el nuevo estado
        setIsAuthLoading(false);
      }
    };

    window.addEventListener("profile_loaded", handleProfileLoaded);
    return () => window.removeEventListener("profile_loaded", handleProfileLoaded);
  }, []);

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
    try {
      setIsProcessing(true);
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
      
      // Disparar evento para que otros hooks carguen datos del nuevo usuario
      console.log("📡 Disparando evento user_logged_in");
      window.dispatchEvent(new CustomEvent("user_logged_in", { 
        detail: { token: newToken } 
      }));
      
      console.log("✅ Login completado - Redirigiendo a /home en 500ms");
      
      // Redirigir a home para asegurar que todo el estado se actualice correctamente
      setTimeout(() => {
        window.location.href = "/home";
      }, 500);
      
    } catch (error) {
      console.error("❌ Error en login:", error);
      setIsProcessing(false);
      throw error;
    }
  };

  // Función para hacer logout
  const logout = () => {
    setIsProcessing(true);
    console.log("🚪 Iniciando logout...");
    
    // Limpiar localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("temp_cart"); // Limpiar carrito temporal  
    localStorage.removeItem("isAdmin");
    
    // Limpiar estados
    setToken(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsAuthLoading(false);
    
    // Disparar evento para que otros hooks se limpien
    console.log("📡 Disparando evento user_logged_out");
    window.dispatchEvent(new CustomEvent("user_logged_out"));
    
    console.log("✅ Logout completado - Redirigiendo a /home en 100ms");
    
    // Redirigir a home después de un breve delay para asegurar limpieza completa
    setTimeout(() => {
      window.location.href = "/home";
    }, 100);
  };

  return {
    isLoggedIn,
    token,
    isAdmin,
    isAuthLoading,
    isInitialized,
    isProcessing,
    login,
    logout,
  };
};
