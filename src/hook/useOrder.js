import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { createOrder as createOrderAction } from "../redux/slices/orderSlice.js";
import { useDispatch, useSelector } from "react-redux";

const useOrder = () => {
  const { token, isLoggedIn } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const isCreatingRef = useRef(false);
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders || { items: null, loading: false, error: null });

  // Función para crear orden
  const createOrder = useCallback(
    async (orderData) => {
      if (isCreatingRef.current) {
        console.log("createOrder already in progress");
        return null;
      }

      if (!isLoggedIn || !token) {
        const errorMsg = "Debes iniciar sesión para crear una orden";
        setOrderError(errorMsg);
        throw new Error(errorMsg);
      }

      if (!orderData.cartId) {
        const errorMsg = "Datos del carrito requeridos";
        setOrderError(errorMsg);
        throw new Error(errorMsg);
      }

      try {
        isCreatingRef.current = true;
        setOrderError(null);
        setIsLoading(true);

        console.log('Dispatching createOrder with data:', orderData);
        
        // Dispatch Redux action
        const result = await dispatch(createOrderAction({ orderData, token })).unwrap();
        
        console.log('Order created successfully:', result);
        return result;
      } catch (err) {
        console.error("Error creating order:", err);
        const errorMsg = err.message || "Error al crear la orden";
        setOrderError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setIsLoading(false);
        isCreatingRef.current = false;
      }
    },
    [dispatch, isLoggedIn, token]
  );

  // Success: orden creada
  useEffect(() => {
    if (items) {
      console.log('Order items received:', items);
      setOrder(items);
      setIsLoading(false);
      isCreatingRef.current = false;
    }
  }, [items]);

  // Loading state
  useEffect(() => {
    if (loading && !isCreatingRef.current) {
      setIsLoading(loading);
    }
  }, [loading]);

  // Error state
  useEffect(() => {
    if (error) {
      console.error("Redux order error:", error);
      setOrderError(error);
      setIsLoading(false);
      isCreatingRef.current = false;
    }
  }, [error]);

  return { 
    createOrder, 
    isLoading, 
    error: orderError || error, 
    order 
  };
};

export default useOrder;