import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from "../redux/slices/userSlice";

export const useUserProfile = (callbacks = {}) => {
  const { token, isLoggedIn, isInitialized: authInitialized } = useAuth();
  const hasLoadedRef = useRef(false);
  const dispatch = useDispatch();
  const { profile, isLoading, error, isInitialized } = useSelector((state) => state.user);
  
  // Referencias para tracking de acciones
  const lastActionRef = useRef(null);
  const prevLoadingRef = useRef(isLoading);
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
    const isNowLoading = isLoading;
    
    // Actualizar ref para próxima iteración
    prevLoadingRef.current = isLoading;
    
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
  }, [isLoading, error, profile]);

  // Load profile when auth initializes or changes
  useEffect(() => {
    if (!authInitialized) {
      return;
    }

    // Si el usuario está logueado y hay token
    if (isLoggedIn && token && !isInitialized && !isLoading) {
      console.log("🔄 Cargando perfil de usuario...");
      fetchProfile();
    }
    
    // Si el usuario se deslogueó, ya no necesitamos hacer nada
    // Redux debería limpiar el estado automáticamente
    if (!isLoggedIn && isInitialized) {
      console.log("❌ Usuario deslogueado");
    }
  }, [authInitialized, isLoggedIn, token, isInitialized, isLoading, fetchProfile]);

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