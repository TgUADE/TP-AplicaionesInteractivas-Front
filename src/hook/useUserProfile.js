import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from "../redux/slices/userSlice";

export const useUserProfile = () => {
  const { token, isLoggedIn, isInitialized: authInitialized } = useAuth();
  const hasLoadedRef = useRef(false);
  const dispatch = useDispatch();
  const { profile, isLoading, error, isInitialized } = useSelector((state) => state.user);

  // Función para cargar el perfil
  const fetchProfile = useCallback(() => {
    if (isLoggedIn && token) {
      return dispatch(fetchUserProfile({ token }));
    }
  }, [isLoggedIn, token, dispatch]);

  // Función para actualizar el perfil
  const updateProfile = useCallback(async (profileData) => {
    if (!isLoggedIn || !token) {
      throw new Error("User must be logged in to update profile");
    }
    return dispatch(updateUserProfile({ profileData, token })).unwrap();
  }, [isLoggedIn, token, dispatch]);

  // Función para eliminar la cuenta
  const deleteAccount = useCallback(async () => {
    if (!isLoggedIn || !token) {
      throw new Error("User must be logged in to delete account");
    }
    return dispatch(deleteUserAccount({ token })).unwrap();
  }, [isLoggedIn, token, dispatch]);

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