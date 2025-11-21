import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  logout as logoutAction,
  initializeAuth,
} from "../redux/slices/authSlice";
import { clearUserProfile } from "../redux/slices/userSlice";
import { clearOrderState } from "../redux/slices/orderSlice";

export const useAuth = (callbacks = {}) => {
  const dispatch = useDispatch();
  const { token, isLoggedIn, isLoading, error, isInitialized } = useSelector(
    (state) => state.auth
  );
  const { profile } = useSelector((state) => state.user);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Referencias para tracking de acciones
  const lastActionRef = useRef(null);
  const prevLoadingRef = useRef(isLoading);
  const callbacksRef = useRef(callbacks);
  
  // Actualizar ref de callbacks cuando cambien
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Inicializar auth desde localStorage al montar
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Determinar si es admin desde el perfil
  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.role === "ADMIN");
    } else {
      setIsAdmin(false);
    }
  }, [profile]);

  // Observar cambios en el estado de Redux para mostrar toast
  // Patrón: detectar cuando loading pasa de true -> false
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
    if (lastActionRef.current === 'login') {
      if (isLoggedIn && !error) {
        // Login exitoso
        currentCallbacks.onLoginSuccess?.();
      } else if (error) {
        // Login fallido
        currentCallbacks.onLoginError?.(error);
      }
      lastActionRef.current = null;
    } else if (lastActionRef.current === 'register') {
      if (isLoggedIn && !error) {
        // Registro exitoso
        currentCallbacks.onRegisterSuccess?.();
      } else if (error) {
        // Registro fallido
        currentCallbacks.onRegisterError?.(error);
      }
      lastActionRef.current = null;
    } else if (lastActionRef.current === 'logout') {
      // Logout completado
      currentCallbacks.onLogoutSuccess?.();
      lastActionRef.current = null;
    }
  }, [isLoading, isLoggedIn, error]);

  // Login function - solo dispatch, no manejo de toast
  const login = (credentials) => {
    lastActionRef.current = 'login';
    return dispatch(loginUser(credentials));
  };

  // Register function - solo dispatch, no manejo de toast
  const register = (userInfo) => {
    lastActionRef.current = 'register';
    return dispatch(registerUser(userInfo));
  };

  // Logout function
  const logout = () => {
    console.log("🚪 Iniciando logout...");
    lastActionRef.current = 'logout';

    // Limpiar perfil de usuario
    dispatch(clearUserProfile());
    dispatch(clearOrderState());

    // Limpiar auth
    dispatch(logoutAction());

    console.log("✅ Logout exitoso");
  };

  return {
    isLoggedIn,
    token,
    isAdmin,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
  };
};
