import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile, deleteUserAccount, clearUserProfile } from "../redux/slices/userSlice";

export const useUserProfile = (callbacks = {}) => {
  const { token, isLoggedIn, isInitialized: authInitialized, logout } = useAuth();
  const dispatch = useDispatch();
  const { profile, loading, error, isInitialized } = useSelector((state) => state.user);
  
  // Referencias para tracking de acciones
  const lastActionRef = useRef(null);
  const prevLoadingRef = useRef(loading);
  const callbacksRef = useRef(callbacks);
  const loadedTokenRef = useRef(null); // Token del perfil actualmente cargado
  
  // Actualizar ref de callbacks cuando cambien
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Función para cargar el perfil
  const fetchProfile = useCallback(() => {
    if (isLoggedIn && token) {
      return dispatch(fetchUserProfile({ token }));
    }
  }, [isLoggedIn, token, dispatch]);

  // Función para actualizar el perfil - solo dispatch
  const updateProfile = useCallback((profileData) => {
    if (!isLoggedIn || !token) {
      throw new Error("User must be logged in to update profile");
    }
    lastActionRef.current = 'update';
    return dispatch(updateUserProfile({ profileData, token }));
  }, [isLoggedIn, token, dispatch]);

  // Función para eliminar la cuenta - solo dispatch
  const deleteAccount = useCallback(() => {
    if (!isLoggedIn || !token) {
      throw new Error("User must be logged in to delete account");
    }
    lastActionRef.current = 'delete';
    return dispatch(deleteUserAccount({ token }));
  }, [isLoggedIn, token, dispatch]);

  // Observar cambios en el estado de Redux para ejecutar callbacks
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const isNowLoading = loading;
    
    // Actualizar ref para próxima iteración
    prevLoadingRef.current = loading;
    
    // Solo actuar cuando termina de cargar (transición true -> false)
    if (!wasLoading || isNowLoading) {
      return;
    }
    
    // Usar callbacksRef para obtener los callbacks actuales
    const currentCallbacks = callbacksRef.current;
    
    // Determinar qué acción terminó y llamar callback apropiado
    if (lastActionRef.current === 'update') {
      if (!error && profile) {
        // Actualización exitosa
        currentCallbacks.onUpdateSuccess?.();
      } else if (error) {
        // Actualización fallida
        currentCallbacks.onUpdateError?.(error);
      }
      lastActionRef.current = null;
    } else if (lastActionRef.current === 'delete') {
      if (!error) {
        // Eliminación exitosa
        currentCallbacks.onDeleteSuccess?.();
      } else if (error) {
        // Eliminación fallida
        currentCallbacks.onDeleteError?.(error);
      }
      lastActionRef.current = null;
    }
  }, [loading, error, profile]);

  // Manejar errores de perfil (ej: token inválido)
  useEffect(() => {
    // Solo manejar errores críticos cuando hay un perfil válido cargado
    // Esto evita cerrar sesión innecesariamente durante cargas iniciales
    if (error && isLoggedIn && token && profile) {
      const errorMessage = error.message || error;
      
      // Si el error es 500 o 401, probablemente el token es inválido
      if (errorMessage.includes('500') || errorMessage.includes('401')) {
        console.log("⚠️ Token inválido detectado, cerrando sesión...");
        logout();
      }
    }
  }, [error, isLoggedIn, token, profile, logout]);

  // Load profile when needed
  useEffect(() => {
    console.log("📊 [useUserProfile] Estado actual:", {
      authInitialized,
      isLoggedIn,
      hasToken: !!token,
      isInitialized,
      loading,
      hasProfile: !!profile,
      loadedToken: loadedTokenRef.current ? "exists" : "null"
    });

    if (!authInitialized) {
      console.log("⏳ Auth no inicializado aún");
      return;
    }

    // Si no hay usuario logueado, limpiar el token cargado
    if (!isLoggedIn || !token) {
      if (loadedTokenRef.current) {
        console.log("🔄 Usuario deslogueado - limpiando referencia de token");
        loadedTokenRef.current = null;
      }
      return;
    }

    // Si el token que tenemos es diferente al token cargado
    if (loadedTokenRef.current !== token) {
      console.log("🔑 Token diferente detectado:");
      console.log("   - Cargado:", loadedTokenRef.current ? "exists" : "null");
      console.log("   - Actual:", token ? "exists" : "null");
      
      // Si había un token anterior diferente, limpiar perfil
      if (loadedTokenRef.current && loadedTokenRef.current !== token) {
        console.log("   → Limpiando perfil anterior");
        dispatch(clearUserProfile());
      }
      
      // Si no está cargando, cargar el perfil del nuevo token
      if (!loading) {
        console.log("   → Cargando perfil para nuevo token");
        loadedTokenRef.current = token;
        fetchProfile();
      }
    } else {
      console.log("✅ Token ya cargado, no se requiere acción");
    }
  }, [authInitialized, isLoggedIn, token, loading, fetchProfile, dispatch, profile, isInitialized]);

  return {
    profile,
    isLoading: loading,
    error,
    isInitialized,
    fetchProfile,
    updateProfile,
    deleteAccount,
  };
};