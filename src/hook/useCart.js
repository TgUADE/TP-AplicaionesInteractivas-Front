import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const API_BASE_URL = "http://localhost:8081";
const LOCAL_CART_KEY = "temp_cart";

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, isLoggedIn } = useAuth();

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
    if (!isLoggedIn) {
      // Si no está logueado, cargar carrito local
      const localItems = loadLocalCart();
      setCartItems(localItems);
      return null;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/carts`, {
        method: "GET",
        headers,
      });

      if (response.status === 404) {
        // No hay carrito, crear uno
        return await createCart();
      }

      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
      }

      const cartData = await response.json();
      setCart(cartData);

      if (cartData.productIds && cartData.productIds.length > 0) {
        await fetchCartItems(cartData);
      } else {
        setCartItems([]);
      }

      return cartData;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Sincronizar carrito local con el backend cuando el usuario se loguea
  const syncLocalCartWithBackend = async () => {
    if (!isLoggedIn || !cart) return;

    const localItems = loadLocalCart();
    if (localItems.length === 0) return;

    try {
      setIsLoading(true);

      // Agregar cada item local al carrito del backend
      for (const item of localItems) {
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

        if (!response.ok) {
          console.error(`Error syncing item ${item.productId}`);
        }
      }

      // Limpiar carrito local después de sincronizar
      clearLocalCart();

      // Refrescar el carrito del backend
      await getCart();
    } catch (err) {
      setError("Error al sincronizar el carrito");
    } finally {
      setIsLoading(false);
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

      // Refrescar los items del carrito
      await fetchCartItems(updatedCart);

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
        } else {
          existingItem.quantity = quantity;
          saveLocalCart(localItems);
          setCartItems(localItems);
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
      await fetchCartItems(updatedCart);

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
      await fetchCartItems(updatedCart);

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
      const response = await fetch(`${API_BASE_URL}/carts/${cart.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Error al limpiar el carrito");
      }

      setCart(null);
      setCartItems([]);

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
      // Aquí necesitarías un endpoint para obtener los productos con cantidades
      // Por ahora simularemos con los productIds
      const items = cartData.productIds.map((productId) => ({
        productId,
        quantity: 1, // Por defecto cantidad 1
      }));
      setCartItems(items);
    } catch (err) {
      setError("Error al obtener los productos del carrito");
    }
  };

  // Cargar carrito al inicializar
  useEffect(() => {
    getCart();
  }, []);

  // Sincronizar carrito local cuando el usuario se loguea
  useEffect(() => {
    if (isLoggedIn && cart) {
      syncLocalCartWithBackend();
    }
  }, [isLoggedIn, cart]);

  return {
    cart,
    cartItems,
    isLoading,
    error,
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
