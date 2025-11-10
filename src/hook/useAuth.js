import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, logout as logoutAction, initializeAuth } from "../redux/slices/authSlice";
import { clearUserProfile } from "../redux/slices/userSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, isLoggedIn, isLoading, error, isInitialized } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.user);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // Login function
  const login = async (credentials) => {
    try {
      console.log("🔐 Attempting login with credentials:", credentials);
      const resultAction = await dispatch(loginUser(credentials));
      
      if (loginUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        console.log("✅ Login successful:", userData);
        return userData;
      } else {
        throw new Error(resultAction.error?.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      throw err;
    }
  };

  // Register function
  const register = async (userInfo) => {
    try {
      console.log("📝 Attempting registration:", userInfo);
      const resultAction = await dispatch(registerUser(userInfo));
      
      if (registerUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        console.log("✅ Registration successful:", userData);
        return userData;
      } else {
        throw new Error(resultAction.error?.message || "Registration failed");
      }
    } catch (err) {
      console.error("❌ Registration failed:", err);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    console.log("🚪 Iniciando logout...");
    
    // Limpiar perfil de usuario
    dispatch(clearUserProfile());
    
    // Limpiar auth
    dispatch(logoutAction());
    
    console.log("✅ Logout completado - Redirigiendo a /home");
    
    // Redirigir a home
    setTimeout(() => {
      window.location.href = "/home";
    }, 100);
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