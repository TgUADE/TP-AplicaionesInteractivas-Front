import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from "../redux/slices/userSlice";

export const useUserProfile = (callbacks = {}) => {
  const { token, isLoggedIn, isInitialized: authInitialized, logout } = useAuth();
  const hasLoadedRef = useRef(false);
  const dispatch = useDispatch();
  const { profile, loading, error, isInitialized } = useSelector((state) => state.user);
  
  // Referencias para tracking de acciones
  const lastActionRef = useRef(null);
  const prevLoadingRef = useRef(loading);
  const callbacksRef = useRef(callbacks);
  
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

  // Load profile when auth initializes or changes
  useEffect(() => {
    if (!authInitialized) {
      return;
    }

    // Resetear flag cuando el perfil se limpia (isInitialized vuelve a false)
    if (!isInitialized && hasLoadedRef.current) {
      console.log("🔄 Perfil limpiado - reseteando flag de carga");
      hasLoadedRef.current = false;
    }

    // Solo cargar perfil si:
    // 1. Usuario está logueado y hay token
    // 2. El perfil no está inicializado
    // 3. No está cargando
    // 4. No se ha cargado antes (evita recargas innecesarias)
    if (isLoggedIn && token && !isInitialized && !loading && !hasLoadedRef.current) {
      console.log("🔄 Cargando perfil de usuario...");
      hasLoadedRef.current = true;
      fetchProfile();
    }
  }, [authInitialized, isLoggedIn, token, isInitialized, loading, fetchProfile]);

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