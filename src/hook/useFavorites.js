import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = "/api";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { token, isLoggedIn, isInitialized: authInitialized } = useAuth();
  const hasLoadedRef = useRef(false);
  
  const headers = useMemo(() => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }), [token]);

  const fetchFavorites = useCallback(async () => {
    if (!isLoggedIn || !token) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/my-favorites`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          setFavorites([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError(error.message);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, headers]);

  // Add product to favorites
  const addToFavorites = useCallback(async (productId) => {
    
    if (!isLoggedIn || !token) {
      setError("Debes iniciar sesión para agregar favoritos");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 400) {
          throw new Error("El producto ya está en favoritos");
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const newFavorite = await response.json();
      setFavorites(prev => [...prev, newFavorite]);
      return true;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, headers]);

  // Remove product from favorites
  const removeFromFavorites = useCallback(async (productId) => {
    if (!isLoggedIn || !token) {
      setError("Debes iniciar sesión para gestionar favoritos");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("El producto no está en favoritos");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
      return true;
    } catch (error) {
      console.error("Error removing from favorites:", error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, headers]);

  // Toggle favorite status using the dedicated endpoint
  const toggleFavorite = useCallback(async (productId) => {
    
    if (!productId) {
      setError("ID de producto requerido");
      return false;
    }
    
    if (!isLoggedIn || !token) {
      setError("Debes iniciar sesión para gestionar favoritos");
      return false;
    }

    setIsLoading(true);
    setError(null);

    // Optimistic update: change UI immediately
    const wasAlreadyFavorite = favorites.some(fav => fav.product.id === productId);
    
    // Update favorites list optimistically
    if (wasAlreadyFavorite) {
      // Remove from favorites immediately
      setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
    } else {
      // Add to favorites immediately (create a temporary favorite)
      setFavorites(prev => [...prev, { product: { id: productId } }]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/products/${productId}/toggle`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        // Revert optimistic update on error
        if (wasAlreadyFavorite) {
          // Restore the favorite
          setFavorites(prev => [...prev, { product: { id: productId } }]);
        } else {
          // Remove the temporary favorite
          setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
        }
        
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Success: refresh the full list to get complete data from backend
      await fetchFavorites();
      
      return true;
    } catch (error) {
      // Revert optimistic update on error
      if (wasAlreadyFavorite) {
        setFavorites(prev => [...prev, { product: { id: productId } }]);
      } else {
        setFavorites(prev => prev.filter(fav => fav.product.id !== productId));
      }
      
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, token, headers, favorites, fetchFavorites]);

  // Check if product is favorite
  const isFavorite = useCallback((productId) => {
    return favorites.some(fav => fav.product.id === productId);
  }, [favorites]);

  // Cargar favoritos cuando cambia el estado de autenticación
  useEffect(() => {
    // Esperar a que la autenticación esté inicializada
    if (!authInitialized) {
      return;
    }

    // Evitar cargar múltiples veces
    if (hasLoadedRef.current && isInitialized) {
      console.log("useFavorites ya inicializado, usando cache");
      return;
    }

    console.log("🔄 useFavorites: Inicializando - isLoggedIn:", isLoggedIn, "token:", token ? "✓" : "✗");
    
    const loadFavorites = async () => {
      if (isLoggedIn && token) {
        console.log("✅ Usuario autenticado, cargando favoritos...");
        await fetchFavorites();
      } else {
        console.log("❌ Sin autenticación, limpiando favoritos");
        setFavorites([]);
      }
      
      setIsInitialized(true);
      hasLoadedRef.current = true;
    };

    loadFavorites();
  }, [authInitialized, isLoggedIn, token, fetchFavorites]);

  // Listener para eventos de login/logout
  useEffect(() => {
    const handleLogout = () => {
      console.log("🚪 Evento LOGOUT recibido en useFavorites");
      setFavorites([]);
      setError(null);
      hasLoadedRef.current = false;
      setIsInitialized(false);
    };
    
    const handleLogin = async (event) => {
      console.log("🔐 Evento LOGIN recibido en useFavorites");
      const newToken = event.detail?.token;
      
      if (newToken && !isLoading) {
        console.log("❤️ Token recibido del evento, cargando favoritos...");
        
        // Reset el flag para permitir la carga
        hasLoadedRef.current = false;
        
        // Usar el token del evento directamente para hacer el fetch
        try {
          setIsLoading(true);
          
          const response = await fetch(`${API_BASE_URL}/favorites/my-favorites`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setFavorites(Array.isArray(data) ? data : []);
            console.log("✅ Favoritos cargados desde login:", data.length);
          } else if (response.status === 404) {
            setFavorites([]);
            console.log("✅ Sin favoritos guardados");
          }
          
          hasLoadedRef.current = true;
        } catch (error) {
          console.error("Error cargando favoritos tras login:", error);
        } finally {
          setIsLoading(false);
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
    favorites,
    isLoading,
    error,
    isInitialized,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    fetchFavorites,
  };
};
