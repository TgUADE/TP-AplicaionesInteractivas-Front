import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = "/api";
const LOCAL_CART_KEY = "temp_cart";
const CART_UPDATED_EVENT = "cart_updated";

const broadcastCartUpdated = () => {
  try {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  } catch (error) {
    console.error("Error broadcasting cart updated:", error);
  }
};

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGettingCart, setIsGettingCart] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { token, isLoggedIn, isInitialized: authInitialized } = useAuth();
  const hasLoadedRef = useRef(false);

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Cargar carrito local del localStorage
  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem(LOCAL_CART_KEY);
      if (localCart) {
        return JSON.parse(localCart);
      }
    } catch (error) {
      console.error("Error loading local cart:", error);
    }
    return [];
  };

  const syncLocalItemsToCart = async (cart, localItems) => {
    if (isSyncing) {
      console.log("🔄 Sincronización ya en progreso, saltando...");
      return;
    }
    setIsSyncing(true);
    try {
      console.log(
        "Sincronizando",
        localItems.length,
        "items al carrito",
        cart.id
      );

      let successCount = 0;
      let errorCount = 0;

      for (const item of localItems) {
        try {
          console.log(
            `Agregando producto ${item.productId} cantidad ${item.quantity}`
          );

          const response = await fetch(
            `${API_BASE_URL}/carts/${cart.id}/products`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
              }),
            }
          );

          if (response.ok) {
            console.log(`✅ Producto ${item.productId} agregado correctamente`);
            successCount++;
          } else {
            console.error(
              `❌ Error agregando producto ${item.productId}:`,
              response.status,
              response.statusText
            );
            const errorText = await response.text();
            console.error("Error details:", errorText);
            errorCount++;
          }
        } catch (itemError) {
          console.error(
            `❌ Error de red agregando producto ${item.productId}:`,
            itemError
          );
          errorCount++;
        }

        // Pequeña pausa entre requests para evitar problemas de concurrencia
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(
        `Sincronización completada: ${successCount} exitosos, ${errorCount} errores`
      );

      // Limpiar carrito local solo si al menos algunos productos se sincronizaron
      if (successCount > 0) {
        clearLocalCart();
        console.log("Carrito local limpiado");
      }
    } catch (err) {
      console.error("Error general en sincronización:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Guardar carrito local en localStorage
  const saveLocalCart = (items) => {
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving local cart:", error);
    }
  };

  // Limpiar carrito local
  const clearLocalCart = () => {
    localStorage.removeItem(LOCAL_CART_KEY);
  };

  // Crear carrito en el backend
  const createCart = async () => {
    if (!isLoggedIn) {
      setError("Debes estar logueado para crear un carrito");
      return null;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ productIds: [] }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el carrito");
      }

      const newCart = await response.json();
      setCart(newCart);
      setCartItems([]);
      return newCart;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener carrito del usuario logueado
  const getCart = async () => {
    if (isGettingCart) {
      console.log("🔄 getCart ya en progreso, saltando...");
      return null;
    }

    if (!isLoggedIn) {
      const localItems = loadLocalCart();
      setCartItems(localItems);
      return null;
    }

    setIsGettingCart(true);

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/carts/my-carts`, {
        method: "GET",
        headers,
      });

      console.log("responseACA", response);

      if (response.status === 404) {
        const localItems = loadLocalCart();
        console.log("no hay carrito en el backend, creando con:", localItems);

        if (localItems.length > 0 && !isSyncing) {
          console.log("Creando carrito y sincronizando items local");
          const newCart = await createCart();
          if (newCart) {
            await syncLocalItemsToCart(newCart, localItems);
          }
          return newCart;
        } else {
          return await createCart();
        }
      }

      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
      }

      const cartData = await response.json();
      console.log("cartData", cartData);
      const userCart = Array.isArray(cartData) ? cartData[0] : cartData;
      console.log("userCart", userCart);

      if (!userCart) {
        const localItems = loadLocalCart();
        console.log("no hay carrito en el backend, creando con:", localItems);
        if (localItems.length > 0 && !isSyncing) {
          console.log("Creando carrito y sincronizando items local");
          const newCart = await createCart();
          if (newCart) {
            await syncLocalItemsToCart(newCart, localItems);
          }
          return newCart;
        } else {
          setCart(null);
          setCartItems([]);
          return null;
        }
      }

      setCart(userCart);

      const items = (userCart.cartProducts || [])
        .map((product) => ({
          productId: product?.product?.id,
          quantity: product.quantity,
          name: product?.product?.name,
          price: product?.product?.price,
        }))
        .filter((item) => item.productId !== null);
      console.log("items", items);
      setCartItems(items);
      return userCart;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
      setIsGettingCart(false);
    }
  };

  // Agregar producto al carrito
  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn) {
      // Si no está logueado, agregar al carrito local
      const localItems = loadLocalCart();
      const existingItem = localItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        localItems.push({ productId, quantity });
      }

      saveLocalCart(localItems);
      setCartItems(localItems);
      broadcastCartUpdated();
      return true;
    }

    try {
      setIsLoading(true);

      // Si no hay carrito, crear uno
      let currentCart = cart;
      if (!currentCart) {
        currentCart = await createCart();
        if (!currentCart) return false;
      }

      const response = await fetch(
        `${API_BASE_URL}/carts/${currentCart.id}/products`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            productId,
            quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al agregar producto al carrito");
      }

      // Actualizar el carrito local
      const updatedCart = await response.json();
      setCart(updatedCart);

      await getCart();
      broadcastCartUpdated();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar cantidad de producto
  const updateQuantity = async (productId, quantity) => {
    if (!isLoggedIn) {
      // Actualizar carrito local
      const localItems = loadLocalCart();
      const existingItem = localItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        if (quantity <= 0) {
          const filteredItems = localItems.filter(
            (item) => item.productId !== productId
          );
          saveLocalCart(filteredItems);
          setCartItems(filteredItems);
          broadcastCartUpdated();
        } else {
          existingItem.quantity = quantity;
          saveLocalCart(localItems);
          setCartItems(localItems);
          broadcastCartUpdated();
        }
      }
      return true;
    }

    if (!cart) return false;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/carts/${cart.id}/products/${productId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar la cantidad");
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
      await getCart();
      broadcastCartUpdated();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = async (productId) => {
    if (!isLoggedIn) {
      // Eliminar del carrito local
      const localItems = loadLocalCart();
      const filteredItems = localItems.filter(
        (item) => item.productId !== productId
      );
      saveLocalCart(filteredItems);
      setCartItems(filteredItems);
      broadcastCartUpdated();
      return true;
    }

    if (!cart) return false;

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/carts/${cart.id}/product/${productId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar producto del carrito");
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
      await getCart();
      broadcastCartUpdated();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    if (!isLoggedIn) {
      clearLocalCart();
      setCartItems([]);
      return true;
    }

    if (!cart) return false;

    try {
      setIsLoading(true);
      if (cartItems.length > 0) {
        console.log("Limpiando carrito en el backend");
        for (const item of cartItems) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/carts/${cart.id}/product/${item.productId}`,
              {
                method: "DELETE",
                headers,
              }
            );
            if (!response.ok) {
              console.error(
                `Error elimnando producto ${item.productId}`,
                response.status,
                response.statusText
              );
            } else {
              console.log(
                `✅ Producto ${item.productId} eliminado correctamente`
              );
            }
          } catch (itemError) {
            console.error(
              `Error eliminando producto ${item.productId}`,
              itemError
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      const response = await fetch(`${API_BASE_URL}/carts/${cart.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Error al limpiar el carrito");
      }

      setCart(null);
      setCartItems([]);
      broadcastCartUpdated();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener detalles de los productos del carrito
  const fetchCartItems = async (cartData) => {
    try {
      if (cartData?.cartProducts?.length) {
        const items = cartData.cartProducts
          .map((cp) => ({
            productId: cp.product?.id,
            quantity: cp.quantity,
          }))
          .filter((it) => !!it.productId);
        setCartItems(items);
        return;
      }

      // Fallback legado si existiera productIds
      if (cartData?.productIds?.length) {
        const items = cartData.productIds.map((productId) => ({
          productId,
          quantity: 1,
        }));
        setCartItems(items);
        return;
      }

      setCartItems([]);
    } catch (err) {
      setError("Error al obtener los productos del carrito");
    }
  };

  // Cargar carrito cuando cambia el estado de autenticación
  useEffect(() => {
    // Esperar a que la autenticación esté inicializada
    if (!authInitialized) {
      return;
    }

    // Evitar cargar múltiples veces
    if (hasLoadedRef.current && isInitialized) {
      console.log("⚡ useCart ya inicializado, usando cache");
      return;
    }

    console.log("🔄 useCart: Inicializando - isLoggedIn:", isLoggedIn, "token:", token ? "✓" : "✗");

    const loadCart = async () => {
      if (isLoggedIn && token) {
        const localItems = loadLocalCart();
        console.log("✅ Usuario autenticado, items locales:", localItems.length);
        console.log("🛒 Cargando carrito del backend...");
        await getCart();
      } else {
        console.log("❌ Sin autenticación, usando carrito local");
        const localItems = loadLocalCart();
        setCartItems(localItems);
      }
      
      setIsInitialized(true);
      hasLoadedRef.current = true;
    };

    loadCart();
  }, [authInitialized, isLoggedIn, token]);

  // Listener para eventos de actualización del carrito
  useEffect(() => {
    const handler = async () => {
      if (!isLoading && !isGettingCart && isLoggedIn && token) {
        console.log("🔄 Evento CART_UPDATED recibido");
        await getCart();
      }
    };
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, [isLoggedIn, token, isLoading, isGettingCart]);

  // Listener para eventos de login/logout
  useEffect(() => {
    const handleLogout = () => {
      console.log("🚪 Evento LOGOUT recibido en useCart");
      setCart(null);
      setCartItems([]);
      setError(null);
      clearLocalCart();
      hasLoadedRef.current = false;
      setIsInitialized(false);
    };
    
    const handleLogin = async (event) => {
      console.log("🔐 Evento LOGIN recibido en useCart");
      const newToken = event.detail?.token;
      
      if (newToken && !isGettingCart) {
        console.log("📦 Token recibido del evento, cargando carrito...");
        
        // Reset el flag para permitir la carga
        hasLoadedRef.current = false;
        
        // Cargar items locales primero
        const localItems = loadLocalCart();
        console.log("Items locales encontrados:", localItems.length);
        
        try {
          setIsLoading(true);
          setIsGettingCart(true);
          
          // Obtener carrito del backend con el token del evento
          const headersWithToken = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newToken}`,
          };
          
          const response = await fetch(`${API_BASE_URL}/carts/my-carts`, {
            method: "GET",
            headers: headersWithToken,
          });

          if (response.status === 404) {
            console.log("No hay carrito, creando uno nuevo...");
            
            // Crear carrito
            const createResponse = await fetch(`${API_BASE_URL}/carts`, {
              method: "POST",
              headers: headersWithToken,
              body: JSON.stringify({ productIds: [] }),
            });
            
            if (createResponse.ok) {
              const newCart = await createResponse.json();
              setCart(newCart);
              
              // Sincronizar items locales si hay
              if (localItems.length > 0) {
                console.log("Sincronizando items locales al nuevo carrito...");
                await syncLocalItemsToCart(newCart, localItems);
              }
              
              // Recargar carrito después de sincronizar
              setIsGettingCart(false);
              await getCart();
            }
          } else if (response.ok) {
            const cartData = await response.json();
            const userCart = Array.isArray(cartData) ? cartData[0] : cartData;
            
            if (userCart) {
              setCart(userCart);
              
              const items = (userCart.cartProducts || [])
                .map((product) => ({
                  productId: product?.product?.id,
                  quantity: product.quantity,
                  name: product?.product?.name,
                  price: product?.product?.price,
                }))
                .filter((item) => item.productId !== null);
              
              setCartItems(items);
              console.log("✅ Carrito cargado desde login:", items.length, "items");
              
              // Sincronizar items locales si hay
              if (localItems.length > 0) {
                console.log("Sincronizando items locales al carrito existente...");
                await syncLocalItemsToCart(userCart, localItems);
                // Recargar después de sincronizar
                setIsGettingCart(false);
                await getCart();
              }
            }
          }
          
          hasLoadedRef.current = true;
          broadcastCartUpdated();
        } catch (error) {
          console.error("Error cargando carrito tras login:", error);
        } finally {
          setIsLoading(false);
          setIsGettingCart(false);
        }
      }
    };
    
    window.addEventListener("user_logged_out", handleLogout);
    window.addEventListener("user_logged_in", handleLogin);
    
    return () => {
      window.removeEventListener("user_logged_out", handleLogout);
      window.removeEventListener("user_logged_in", handleLogin);
    };
  }, [isGettingCart]); // Incluir isGettingCart para evitar llamadas concurrentes

  return {
    cart,
    cartItems,
    isLoading,
    error,
    isInitialized,
    createCart,
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartItemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    isLocalCart: !isLoggedIn && cartItems.length > 0, // Indicador de si es carrito local
  };
};
