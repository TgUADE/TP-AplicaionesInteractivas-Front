import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeCart,
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  syncMemoryCartToBackend,
} from "../redux/slices/cartSlice.js";

export const useCart = (callbacks = {}) => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state.cart);
  const authState = useSelector((state) => state.auth);
  
  const {
    cart,
    cartItems,
    loading,
    error,
    isInitialized,
    needsSync,
  } = cartState || {
    cart: null,
    cartItems: [],
    loading: false,
    error: null,
    isInitialized: false,
    needsSync: false,
  };

  const { isLoggedIn } = authState || {
    isLoggedIn: false,
  };
  
  // Ref para rastrear el estado anterior de isLoggedIn
  const prevIsLoggedInRef = useRef(isLoggedIn);
  
  // Ref para evitar múltiples sincronizaciones simultáneas
  const isSyncingRef = useRef(false);
  
  // Referencias para tracking de acciones
  const lastActionRef = useRef(null);
  const prevLoadingRef = useRef(loading);
  const prevErrorRef = useRef(error);
  const callbacksRef = useRef(callbacks);
  
  // Actualizar ref de callbacks cuando cambien
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  // Inicializar carrito al montar
  useEffect(() => {
    if (!isInitialized) {
      console.log('🔄 useCart: Inicializando carrito por primera vez');
      dispatch(initializeCart());
    }
  }, [dispatch, isInitialized]);

  // Detectar cuando el usuario inicia sesión (transición de no autenticado a autenticado)
  useEffect(() => {
    const prevIsLoggedIn = prevIsLoggedInRef.current;
    
    // Actualizar la ref
    prevIsLoggedInRef.current = isLoggedIn;
    
    // Solo actuar en la transición de false -> true
    if (!prevIsLoggedIn && isLoggedIn && isInitialized) {
      console.log('🔑 Usuario acaba de iniciar sesión - Re-inicializando carrito');
      // Re-inicializar el carrito para obtener el del backend o detectar que necesita sync
      dispatch(initializeCart());
    }
  }, [isLoggedIn, isInitialized, dispatch]);

  // Sincronizar carrito cuando se detecta que es necesario (needsSync)
  useEffect(() => {
    if (needsSync && isLoggedIn && isInitialized && cartItems.length > 0 && !isSyncingRef.current && !loading) {
      console.log('🔔 needsSync detectado - Sincronizando carrito...');
      isSyncingRef.current = true; // Marcar que estamos sincronizando
      dispatch(syncMemoryCartToBackend());
    }
    
    // Cuando termina de cargar, resetear el flag
    if (!loading && isSyncingRef.current && !needsSync) {
      console.log('✅ Sincronización completada - Reseteando flag');
      isSyncingRef.current = false;
    }
  }, [needsSync, isLoggedIn, isInitialized, cartItems.length, loading, dispatch]);

  // Observar cambios en el estado de Redux para ejecutar callbacks
  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const isNowLoading = loading;
    const prevError = prevErrorRef.current;
    const currentAction = lastActionRef.current;
    
    // Actualizar refs para próxima iteración
    prevLoadingRef.current = loading;
    prevErrorRef.current = error;
    
    // Solo actuar cuando termina de cargar (transición true -> false)
    if (!wasLoading || isNowLoading) {
      return;
    }
    
    // Usar callbacksRef para obtener los callbacks actuales
    const currentCallbacks = callbacksRef.current;
    
    // Determinar qué acción terminó y llamar callback apropiado
    if (currentAction === 'add') {
      if (!error) {
        currentCallbacks.onAddSuccess?.();
      } else if (error !== prevError) {
        currentCallbacks.onAddError?.(error);
      }
      lastActionRef.current = null;
    } else if (currentAction === 'update') {
      if (!error) {
        currentCallbacks.onUpdateSuccess?.();
      } else if (error !== prevError) {
        currentCallbacks.onUpdateError?.(error);
      }
      lastActionRef.current = null;
    } else if (currentAction === 'remove') {
      if (!error) {
        currentCallbacks.onRemoveSuccess?.();
      } else if (error !== prevError) {
        currentCallbacks.onRemoveError?.(error);
      }
      lastActionRef.current = null;
    } else if (currentAction === 'clear') {
      if (!error) {
        currentCallbacks.onClearSuccess?.();
      } else if (error !== prevError) {
        currentCallbacks.onClearError?.(error);
      }
      lastActionRef.current = null;
    }
  }, [loading, error]);

  // Agregar producto al carrito
  const addToCart = useCallback(
    (product, quantity = 1) => {
      console.log('🟡 [useCart] Pasando a Redux Slice...');
      lastActionRef.current = 'add';
      return dispatch(addToCartAction({ product, quantity }));
    },
    [dispatch]
  );

  // Actualizar cantidad de producto
  const updateQuantity = useCallback(
    (productId, quantity) => {
      lastActionRef.current = 'update';
      if (quantity <= 0) {
        return dispatch(removeFromCartAction(productId));
      } else {
        return dispatch(updateQuantityAction({ productId, quantity }));
      }
    },
    [dispatch]
  );

  // Remover producto del carrito
  const removeFromCart = useCallback(
    (productId) => {
      lastActionRef.current = 'remove';
      return dispatch(removeFromCartAction(productId));
    },
    [dispatch]
  );

  // Limpiar carrito
  const clearCart = useCallback(() => {
    lastActionRef.current = 'clear';
    return dispatch(clearCartAction());
  }, [dispatch]);

  // Obtener cantidad total de items
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Obtener precio total
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // Verificar si un producto está en el carrito
  const isInCart = useCallback(
    (productId) => {
      return cartItems.some((item) => item.productId === productId);
    },
    [cartItems]
  );

  // Obtener cantidad de un producto específico
  const getProductQuantity = useCallback(
    (productId) => {
      const item = cartItems.find((item) => item.productId === productId);
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  const cartItemCount = getTotalItems();
  const isLocalCart = !isLoggedIn;

  return {
    // Estado
    cart,
    cartItems,
    isLoading: loading,
    error,
    isLoggedIn,
    
    // Compatibilidad con Navigation
    cartItemCount,
    isLocalCart,
    
    // Métodos
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
    getProductQuantity,
  };
};
