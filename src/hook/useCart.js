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

function acquireWindowLock(key) {
  try {
    const w = window;
    if (!w.__locks) w.__locks = new Set();
    if (w.__locks.has(key)) return false;
    w.__locks.add(key);
    return true;
  } catch {
    return true;
  }
}

function releaseWindowLock(key) {
  try {
    const w = window;
    if (w.__locks) w.__locks.delete(key);
  } catch {}
}

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
  const creatingCartRef = useRef(false);

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
            console.log(`✅ Producto ${item.productId} agregado exitosamente`);
            successCount++;
          } else {
            console.error(
              `❌ Error agregando producto ${item.productId}:`,
              response.status
            );
            errorCount++;
          }
        } catch (itemError) {
          console.error(
            `❌ Error de red agregando producto ${item.productId}:`,
            itemError
          );
          errorCount++;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(
        `Sincronización completada: ${successCount} exitosos, ${errorCount} errores`
      );

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

  // Crear carrito en el backend (con lock para evitar duplicados)
  const createCart = async () => {
    if (!isLoggedIn) {
      setError("Debes estar logueado para crear un carrito");
      return null;
    }

    if (creatingCartRef.current) {
      console.log("⏳ createCart en progreso, evitando duplicado");
      return cart;
    }

    try {
      creatingCartRef.current = true;
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
      creatingCartRef.current = false;
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

      if (response.status === 404) {
        const localItems = loadLocalCart();

        if (localItems.length > 0) {
          if (!acquireWindowLock("__cartCreateLock")) {
            console.log("⏳ Otro proceso está creando el carrito");
            return null;
          }

          try {
            const newCart = await createCart();
            if (newCart) {
              await syncLocalItemsToCart(newCart, localItems);
              await getCart();
            }
            return newCart;
          } finally {
            releaseWindowLock("__cartCreateLock");
          }
        }

        setCart(null);
        setCartItems([]);
        return null;
      }

      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
      }

      const cartData = await response.json();

      if (Array.isArray(cartData) && cartData.length === 0) {
        const localItems = loadLocalCart();
        setCart(null);
        setCartItems(localItems);
        return null;
      }

      const userCart = Array.isArray(cartData) ? cartData[0] : cartData;

      if (!userCart) {
        const localItems = loadLocalCart();
        setCart(null);
        setCartItems(localItems);
        return null;
      }

      setCart(userCart);

      const items = (userCart.cartProducts || [])
        .map((cp) => ({
          productId: cp.product?.id,
          quantity: cp.quantity,
          name: cp.product?.name,
          price: cp.product?.current_price || cp.product?.price,
          original_price: cp.product?.original_price,
          promotion: cp.product?.promotion,
          images: cp.product?.images,
          product: cp.product, // Guardar el producto completo
        }))
        .filter((item) => item.productId !== null);

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

  // Agregar producto al carrito - Acepta producto completo o solo ID
  const addToCart = async (productOrId, quantity = 1) => {
    // Determinar si recibimos un producto completo o solo un ID
    const isProductObject = typeof productOrId === 'object' && productOrId !== null;
    const productId = isProductObject ? productOrId.id : productOrId;
    
    if (!productId) {
      console.error("Product ID is required");
      return false;
    }

    if (!isLoggedIn) {
      // Si no está logueado, agregar al carrito local
      const localItems = loadLocalCart();
      const existingItem = localItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // Guardar información completa del producto si está disponible
        const newItem = isProductObject ? {
          productId,
          quantity,
          name: productOrId.name,
          price: productOrId.current_price || productOrId.price,
          original_price: productOrId.original_price,
          promotion: productOrId.promotion,
          images: productOrId.images,
          product: productOrId,
        } : {
          productId,
          quantity,
        };
        localItems.push(newItem);
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
      console.log("Current cart:", currentCart);
      if (!currentCart) {
        currentCart = await getCart();
        console.log("Current cart from backend:", currentCart);
        if (!currentCart) {
          currentCart = await createCart();
          console.log("Current cart created:", currentCart);
          if (!currentCart) return false;
        }
      }

      console.log("Adding product to cart:", { productId, quantity, cartId: currentCart.id });

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
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error al agregar producto al carrito: ${response.status} - ${errorText}`);
      }

      // Refrescar el carrito completo desde el backend
      await getCart();
      broadcastCartUpdated();
      return true;
    } catch (err) {
      console.error("Error in addToCart:", err);
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
        } else {
          existingItem.quantity = quantity;
          saveLocalCart(localItems);
          setCartItems(localItems);
        }
      }
      broadcastCartUpdated();
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
      broadcastCartUpdated();
      return true;
    }

    if (!cart) return false;

    try {
      setIsLoading(true);
      if (cartItems.length > 0) {
        console.log("Limpiando carrito en el backend");
        for (const item of cartItems) {
          await removeFromCart(item.productId);
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
            name: cp.product?.name,
            price: cp.product?.current_price || cp.product?.price,
            original_price: cp.product?.original_price,
            promotion: cp.product?.promotion,
            images: cp.product?.images,
            product: cp.product,
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
    if (!authInitialized) {
      return;
    }

    if (hasLoadedRef.current && isInitialized) {
      console.log("⚡ useCart ya inicializado, usando cache");
      return;
    }

    console.log(
      "🔄 useCart: Inicializando - isLoggedIn:",
      isLoggedIn,
      "token:",
      token ? "✓" : "✗"
    );

    const loadCart = async () => {
      if (isLoggedIn && token) {
        const localItems = loadLocalCart();
        console.log(
          "✅ Usuario autenticado, items locales:",
          localItems.length
        );
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
      if (isLoggedIn && token) {
        if (!isLoading && !isGettingCart) {
          await getCart();
        }
      } else {
        const localItems = loadLocalCart();
        setCartItems(localItems);
      }
    };

    const onStorage = (e) => {
      if (e.key === LOCAL_CART_KEY) {
        const localItems = loadLocalCart();
        setCartItems(localItems);
      }
    };

    window.addEventListener(CART_UPDATED_EVENT, handler);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handler);
      window.removeEventListener("storage", onStorage);
    };
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

        hasLoadedRef.current = false;

        const localItems = loadLocalCart();
        console.log("Items locales encontrados:", localItems.length);

        try {
          await getCart();
        } catch (error) {
          console.error("Error cargando carrito después del login:", error);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    window.addEventListener("user_logged_out", handleLogout);
    window.addEventListener("user_logged_in", handleLogin);

    return () => {
      window.removeEventListener("user_logged_out", handleLogout);
      window.removeEventListener("user_logged_in", handleLogin);
    };
  }, [isGettingCart]);

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
    isLocalCart: !isLoggedIn && cartItems.length > 0,
  };
};