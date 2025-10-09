import { useState, useEffect } from "react";

const URLproducts = "/api/products";
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

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    fetch(URLproducts, options)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setProductsLoaded(true);
          console.log("Products loaded:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProductsLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch categories
  useEffect(() => {
    let isMounted = true;

    fetch(URLcategories, options)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setCategories(data);
          setCategoriesLoaded(true);
          console.log("Categories loaded:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategoriesLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
