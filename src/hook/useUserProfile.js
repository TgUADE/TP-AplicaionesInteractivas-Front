import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = "/api";

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { token, isLoggedIn, isInitialized: authInitialized } = useAuth();
  const hasLoadedRef = useRef(false);

  // Decode JWT to get user ID (for updates and deletes)
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.sub || payload.userId || payload.id;
        console.log("👤 User ID from token:", id);
        setUserId(id);
      } catch (err) {
        console.error("❌ Error decoding token:", err);
      }
    } else {
      setUserId(null);
    }
  }, [token]);

  // Fetch user profile using /me endpoint
  const fetchProfile = useCallback(async (authToken = null) => {
    const currentToken = authToken || token;
    
    if (!currentToken) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}/users/me`;
      console.log("🔄 Fetching user profile from /me endpoint...");
      console.log("📍 Full URL:", url);
      console.log("🔑 Token present:", !!currentToken);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response URL:", response.url);

      if (!response.ok) {
        if (response.status === 404) {
          const errorText = await response.text();
          console.error("❌ 404 Error details:", errorText);
          throw new Error("Profile not found - proxy might not be working");
        }
        const errorText = await response.text();
        console.error("❌ Error details:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Profile loaded:", data);
      setProfile(data);
      
      // Extract user ID from profile for updates/deletes
      if (data.id) {
        setUserId(data.id);
      }
      
      // Dispatch event to sync admin status with useAuth
      if (data.role || data.isAdmin) {
        window.dispatchEvent(new CustomEvent("profile_loaded", { 
          detail: { 
            isAdmin: data.isAdmin === true || data.role === "ADMIN",
            role: data.role 
          } 
        }));
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      setError(err.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Update user profile
  const updateProfile = useCallback(async (updatedData) => {
    if (!isLoggedIn || !token || !profile?.id) {
      setError("User not authenticated or profile not loaded");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Updating user profile:", profile.id);
      
      // Remove fields that shouldn't be sent to backend
      const { id, email, createdAt, ...dataToSend } = updatedData;
      
      console.log("📤 Data to send:", dataToSend);
      
      const response = await fetch(`${API_BASE_URL}/users/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Profile updated:", data);
      setProfile(data);
      return true;
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, profile]);

  // Delete user account
  const deleteAccount = useCallback(async () => {
    if (!isLoggedIn || !token || !profile?.id) {
      setError("User not authenticated or profile not loaded");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔄 Deleting user account:", profile.id);
      const response = await fetch(`${API_BASE_URL}/users/${profile.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      console.log("✅ Account deleted");
      setProfile(null);
      return true;
    } catch (err) {
      console.error("❌ Error deleting account:", err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, profile]);

  // Load profile when auth initializes
  useEffect(() => {
    // Esperar a que la autenticación esté inicializada
    if (!authInitialized) {
      return;
    }

    // Evitar cargar múltiples veces
    if (hasLoadedRef.current && isInitialized) {
      console.log("useUserProfile ya inicializado, usando cache");
      return;
    }

    console.log("🔄 useUserProfile: Inicializando - isLoggedIn:", isLoggedIn, "token:", token ? "✓" : "✗");
    
    const loadProfile = async () => {
      if (isLoggedIn && token) {
        console.log("✅ Usuario autenticado, cargando perfil...");
        await fetchProfile();
      } else {
        console.log("❌ Sin autenticación, limpiando perfil");
        setProfile(null);
        setIsLoading(false);
      }
      
      setIsInitialized(true);
      hasLoadedRef.current = true;
    };

    loadProfile();
  }, [authInitialized, isLoggedIn, token]);

  // Listener para eventos de login/logout
  useEffect(() => {
    const handleLogout = () => {
      console.log("🚪 Evento LOGOUT recibido en useUserProfile");
      setProfile(null);
      setError(null);
      setUserId(null);
      hasLoadedRef.current = false;
      setIsInitialized(false);
      setIsLoading(false);
    };
    
    const handleLogin = async (event) => {
      console.log("🔐 Evento LOGIN recibido en useUserProfile");
      const newToken = event.detail?.token;
      
      if (newToken && !isLoading) {
        console.log("👤 Token recibido del evento, cargando perfil...");
        
        // Reset el flag para permitir la carga
        hasLoadedRef.current = false;
        setIsInitialized(false);
        
        try {
          await fetchProfile(newToken);
          hasLoadedRef.current = true;
          setIsInitialized(true);
          console.log("✅ Perfil cargado desde evento login");
        } catch (error) {
          console.error("Error cargando perfil tras login:", error);
        }
      }
    };
    
    window.addEventListener("user_logged_out", handleLogout);
    window.addEventListener("user_logged_in", handleLogin);
    
    return () => {
      window.removeEventListener("user_logged_out", handleLogout);
      window.removeEventListener("user_logged_in", handleLogin);
    };
  }, [isLoading]); // Incluir isLoading para evitar llamadas concurrentes

  return {
    profile,
    isLoading,
    error,
    isInitialized,
    fetchProfile,
    updateProfile,
    deleteAccount,
  };
};
