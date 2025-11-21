import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../redux/slices/productSlice.js";

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const productDetail = useSelector((state) => state.productDetail);
  const { item, error, loading } = productDetail || {
    item: null,
    error: null,
    loading: false,
  };

  // Fetch product by ID
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  // Success fetch product by ID
  useEffect(() => {
    if (item) {
      setProduct(item);
      setIsLoading(false);
    } else if (!loading && !item) {
      setIsLoading(false);
    }
  }, [item, loading]);

  // Loading state
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Error state
  useEffect(() => {
    if (error) {
      setIsLoading(false);
    }
  }, [error]);

  return {
    product,
    isLoading,
    error,
  };
};
