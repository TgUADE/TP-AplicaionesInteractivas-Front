import { useState, useEffect } from "react";

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

  // Fetch promotional products
  useEffect(() => {
    const fetchPromotionalProducts = async () => {
      try {
        setIsLoadingPromotions(true);
        console.log("Fetching promotional products from:", URLPromotions);
        
        const response = await fetch(URLPromotions, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Promotional products fetched:", data);
        console.log("Number of promotional products:", data?.length || 0);
        
        setPromotionalProducts(data || []);
      } catch (error) {
        console.error("Error fetching promotional products:", error);
        setPromotionalProducts([]);
      } finally {
        setIsLoadingPromotions(false);
      }
    };

    fetchPromotionalProducts();
  }, []);

  return {
    promotionalProducts,
    isLoadingPromotions
  };
};