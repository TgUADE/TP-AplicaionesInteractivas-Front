import { useState, useEffect, use } from "react";
import { useDispatch , useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice.js";
import { fetchCategories } from "../redux/slices/categorySlice.js";

const URLcategories = "/api/categories";
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const dispatch = useDispatch();
  const {items, error, loading}=useSelector(state=>state.products);
  const {items: categoryItems, error: categoryError, loading: categoryLoading}=useSelector(state=>state.categories);

  // Fetch products
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Success fetch products
  useEffect(() => {
    if (items.length > 0) {
      setProducts(items);
      setProductsLoaded(true);
    }
  }, [items]);
  // Error fetch products
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
    }
  }, [error]);
  // Loading state
  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading]);


  // Fetch categories with category redux slice
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Success fetch categories
  useEffect(() => {
    if (categoryItems.length > 0) {
      setCategories(categoryItems);
      setCategoriesLoaded(true);
    }
  }, [categoryItems]);

  // Error fetch categories
  useEffect(() => {
    if (categoryError) {
      console.error("Error fetching categories:", categoryError);
    }
  }, [categoryError]);

  // Loading state
  useEffect(() => {
    if (categoryLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [categoryLoading]);

  // Update loading state
  useEffect(() => {
    if (productsLoaded && categoriesLoaded) {
      setIsLoading(false);
    }
  }, [productsLoaded, categoriesLoaded]);

  // Filter products by category
  const filterProductsByCategory = (products, categories, selectedCategory) => {
    return products.filter((product) => {
      if (selectedCategory === "all") return true;

      const selectedCategoryObj = categories.find(
        (cat) => cat.description === selectedCategory
      );

      if (selectedCategoryObj && product.category) {
        return product.category.id === selectedCategoryObj.id;
      }

      return false;
    });
  };

  return {
    products,
    categories,
    isLoading,
    filterProductsByCategory,
  };
};
