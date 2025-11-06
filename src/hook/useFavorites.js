import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites as fetchFavoritesAction, toggleFavorite as toggleFavoriteAction } from "../redux/slices/favoriteSlice.js";

export const useFavorites = () => {
  const dispatch = useDispatch();
  const { token, isLoggedIn, isInitialized: authInitialized } = useAuth();
  const { items, loading, error } = useSelector((state) => state.favorites || { items: [], loading: false, error: null });
  
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favError, setFavError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasLoadedRef = useRef(false);

  // Fetch favorites - dispatch action
  useEffect(() => {
    if (!authInitialized) return;
    
    if (!isLoggedIn || !token) {
      setFavorites([]);
      setIsInitialized(true);
      return;
    }

    if (hasLoadedRef.current && isInitialized) {
      return;
    }

    console.log("🔄 useFavorites: Loading favorites");
    hasLoadedRef.current = true;
    dispatch(fetchFavoritesAction(token));
  }, [dispatch, authInitialized, isLoggedIn, token, isInitialized]);

  // Success: favoritos cargados
  useEffect(() => {
    if (items && items.length >= 0) {
      console.log("✅ Favorites loaded:", items.length);
      setFavorites(items);
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [items]);

  // Loading state
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Error state
  useEffect(() => {
    if (error) {
      console.error("❌ Favorites error:", error);
      setFavError(error);
      setIsLoading(false);
    }
  }, [error]);

  // Toggle favorite (agregar O eliminar)
  const toggleFavorite = useCallback(
    async (productId) => {
      if (!isLoggedIn || !token) {
        console.error("Debes iniciar sesión para gestionar favoritos");
        return false;
      }

      if (!productId) {
        console.error("ID de producto requerido");
        return false;
      }

      try {
        setIsLoading(true);
        
        // Optimistic update
        const wasAlreadyFavorite = favorites.some(fav => fav.product?.id === productId);
        
        if (wasAlreadyFavorite) {
          setFavorites(prev => prev.filter(fav => fav.product?.id !== productId));
        } else {
          setFavorites(prev => [...prev, { product: { id: productId } }]);
        }

        // Dispatch Redux action
        await dispatch(toggleFavoriteAction({ productId, token })).unwrap();
        
        // Refresh favorites list
        dispatch(fetchFavoritesAction(token));
        
        return true;
      } catch (err) {
        console.error("Error toggling favorite:", err);
        
        // Revert optimistic update
        const wasAlreadyFavorite = favorites.some(fav => fav.product?.id === productId);
        if (wasAlreadyFavorite) {
          setFavorites(prev => [...prev, { product: { id: productId } }]);
        } else {
          setFavorites(prev => prev.filter(fav => fav.product?.id !== productId));
        }
        
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, isLoggedIn, token, favorites]
  );

  // Check if product is favorite
  const isFavorite = useCallback(
    (productId) => {
      return favorites.some(fav => fav.product?.id === productId);
    },
    [favorites]
  );

  // Listener para eventos de login/logout
  useEffect(() => {
    const handleLogout = () => {
      setFavorites([]);
      hasLoadedRef.current = false;
      setIsInitialized(false);
    };
    
    const handleLogin = (event) => {
      const newToken = event.detail?.token;
      if (newToken) {
        hasLoadedRef.current = false;
        dispatch(fetchFavoritesAction(newToken));
      }
    };
    
    window.addEventListener("user_logged_out", handleLogout);
    window.addEventListener("user_logged_in", handleLogin);
    
    return () => {
      window.removeEventListener("user_logged_out", handleLogout);
      window.removeEventListener("user_logged_in", handleLogin);
    };
  }, [dispatch]);

  return {
    favorites,
    isLoading,
    error: favError || error,
    isInitialized,
    toggleFavorite,
    isFavorite,
  };
};