import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPromotions} from "../redux/slices/promotionSlice.js";
import { productsOnSale } from "../redux/slices/promotionSlice.js";

export const usePromotions = () => {
  const dispatch = useDispatch();
  const [promotions, setPromotions] = useState([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const {items, error, loading}=useSelector(state=>state.promotions);
  const {items: saleItems, error: saleError, loading: saleLoading}=useSelector(state=>state.productsOnSale);
  const [promotionalProducts, setPromotionalProducts] = useState([]);

  // Fetch promotions
  useEffect(() => {
    dispatch(fetchPromotions());
  }, [dispatch]);
  // Success fetch promotions
  useEffect(() => {
    if (items.length > 0) {
      setPromotions(items);
    }
  }, [items]);
  // Loading state
  useEffect(() => {
    setIsLoadingPromotions(loading);
  }, [loading]);
  // Error state
  useEffect(() => {
    if (error) {
      console.error("Error fetching promotions:", error);
    }

  }, [error]);

  // Fetch products on sale
  useEffect(() => {
    dispatch(productsOnSale());
  }, [dispatch]);
  // Success fetch products on sale
  useEffect(() => {
    if (saleItems.length > 0) {
      setPromotionalProducts(saleItems);
    }
  }, [saleItems]);
  // Error state for products on sale
  useEffect(() => {
    if (saleError) {
      console.error("Error fetching products on sale:", saleError);
    }
  }, [saleError]);
  // Loading state for products on sale
  useEffect(() => {
    setIsLoadingPromotions(saleLoading);
  }, [saleLoading]);




  return {
    promotions,
    promotionalProducts,
    isLoadingPromotions,
    error,
    saleError,
    saleLoading,
  };
};

