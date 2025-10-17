import { useState, useEffect, useCallback } from "react";

const URLPromotions = "/api/products/on-sale";
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const usePromotions = () => {
  const [promotionalProducts, setPromotionalProducts] = useState([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);

  const fetchPromotionalProducts = useCallback(async () => {
    try {
      setIsLoadingPromotions(true);
      const response = await fetch(URLPromotions, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPromotionalProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching promotional products:", error);
      setPromotionalProducts([]);
    } finally {
      setIsLoadingPromotions(false);
    }
  }, []);

  // Fetch promotional products
  useEffect(() => {
    fetchPromotionalProducts();
  }, [fetchPromotionalProducts]);

  // Escuchar eventos para refrescar cuando admin cambie promociones
  useEffect(() => {
    const handler = () => fetchPromotionalProducts();
    window.addEventListener("promotions_updated", handler);
    return () => window.removeEventListener("promotions_updated", handler);
  }, [fetchPromotionalProducts]);

  return {
    promotionalProducts,
    isLoadingPromotions,
    refreshPromotions: fetchPromotionalProducts,
  };
};
