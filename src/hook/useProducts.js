import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice.js";
import { fetchCategories } from "../redux/slices/categorySlice.js";

export const useProducts = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products);
  const categoriesState = useSelector((state) => state.categories);
  
  const { items, loading, error } = productsState || {
    items: [],
    loading: false,
    error: null,
  };

  const { items: categories, loading: categoriesLoading } = categoriesState || {
    items: [],
    loading: false,
  };

  // Fetch products al montar
  useEffect(() => {
    if (items.length === 0 && !loading) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length, loading]);

  // Fetch categories al montar
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  // Función para filtrar productos por categoría
  const filterProductsByCategory = (products, categories, selectedCategory) => {
    if (selectedCategory === "all") {
      return products;
    }

    const selectedCategoryObj = categories.find(
      (cat) => cat.description === selectedCategory
    );

    if (!selectedCategoryObj) {
      return products;
    }

    return products.filter((product) => {
      if (product.category_id) {
        return product.category_id === selectedCategoryObj.id;
      } else if (product.category && product.category.id) {
        return product.category.id === selectedCategoryObj.id;
      } else if (product.category_name) {
        return product.category_name === selectedCategoryObj.description;
      }
      return false;
    });
  };

  return {
    products: items,
    categories,
    isLoading: loading || categoriesLoading,
    error,
    filterProductsByCategory,
  };
};
