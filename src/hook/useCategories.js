import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice.js";

export const useCategories = () => {
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories);
  
  const { items, loading, error } = categoriesState || {
    items: [],
    loading: false,
    error: null,
  };

  // Fetch categories al montar
  useEffect(() => {
    if (items.length === 0 && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, items.length, loading]);

  return {
    categories: items,
    isLoading: loading,
    error,
  };
};

