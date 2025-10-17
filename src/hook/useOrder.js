import { useState, useMemo, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

const useOrder = () => {
  const { token, isLoggedIn } = useAuth();

  const authHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isCreatingRef = useRef(false);

  const createOrder = useCallback(
    async (orderData) => {
      if (isCreatingRef.current) {
        console.log("createOrder already in progress");
        return null;
      }

      try {
        isCreatingRef.current = true;
        setError(null);
        if (!orderData.cartId) {
          setError("Datos del carrito requeridos");
          return null;
        }
        if (!isLoggedIn || !token) {
          setError("Debes iniciar sesión para gestionar pedidos");
          return null;
        }

        setIsLoading(true);

        const response = await fetch(`/orders`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(orderData),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error("Error del backend:", text);
          throw new Error(text || "Error al crear la orden");
        }

        const data = await response.json();
        setOrder(data);
        return data;
      } catch (err) {
        setError(err.message || "Error al crear la orden");
        return null;
      } finally {
        setIsLoading(false);
        isCreatingRef.current = false;
      }
    },
    [isLoggedIn, token, authHeaders]
  );

  return { createOrder, isLoading, error, order };
};
export default useOrder;
