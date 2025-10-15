import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/Product/ProductGrid";
import ProductFilters from "../components/Product/ProductFilters";
import { useCart } from "../hook/useCart";

const URLproducts = "api/products";
const URLcategories = "api/categories";
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async (product) => {
    const success = await addToCart(product.id, 1);
    if (success) {
      console.log(`Producto ${product.name} agregado al carrito`);
    } else {
      console.log(`Producto ${product.name} no agregado al carrito`);
    }
  };

  // Set initial category and search from URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("search");
    
    if (categoryFromUrl) {
      setSelectedCategory(decodeURIComponent(categoryFromUrl));
    }
    
    if (searchFromUrl) {
      setSearchTerm(decodeURIComponent(searchFromUrl));
    }
  }, [searchParams]);

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

  // Update loading state when both products and categories are loaded
  useEffect(() => {
    if (productsLoaded && categoriesLoaded) {
      setIsLoading(false);
    }
  }, [productsLoaded, categoriesLoaded]);

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Category matching - compare category ID since categories are objects
    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory) {
      // Find the selected category object to get its ID
      const selectedCategoryObj = categories.find(
        (cat) => cat.description === selectedCategory
      );
      console.log("Selected category:", selectedCategory);
      console.log("Found category object:", selectedCategoryObj);
      console.log("Product category info:", {
        category: product.category,
        category_id: product.category_id,
        category_name: product.category_name
      });

      if (selectedCategoryObj) {
        // Try different possible category structures
        if (product.category_id) {
          matchesCategory = product.category_id === selectedCategoryObj.id;
          console.log("Category match (category_id):", matchesCategory, "Expected:", selectedCategoryObj.id, "Actual:", product.category_id);
        } else if (product.category && product.category.id) {
          matchesCategory = product.category.id === selectedCategoryObj.id;
          console.log("Category match (category.id):", matchesCategory, "Expected:", selectedCategoryObj.id, "Actual:", product.category.id);
        } else if (product.category_name) {
          matchesCategory = product.category_name === selectedCategoryObj.description;
          console.log("Category match (category_name):", matchesCategory, "Expected:", selectedCategoryObj.description, "Actual:", product.category_name);
        }
      }
    }

    // Search matching
    const matchesSearch =
      searchTerm === "" ||
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    return matchesCategory && matchesSearch;
  });

  console.log(
    "Filtered products:",
    filteredProducts.length,
    "out of",
    products.length
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.current_price || 0) - (b.current_price || 0);
      case "price-high":
        return (b.current_price || 0) - (a.current_price || 0);
      case "name":
      default:
        return (a.name || "").localeCompare(b.name || "");
    }
  });

  return (
    <div className="min-h-screen bg-white w-full">
      <section className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Products</h1>
          {selectedCategory !== "all" && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/home" className="hover:text-blue-500">
                Home
              </Link>
              <span>›</span>
              <span className="text-blue-600 font-medium">
                {selectedCategory}
              </span>
            </div>
          )}
        </div>

        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          isLoadingCategories={isLoading}
          sortBy={sortBy}
          onSortChange={(e) => setSortBy(e.target.value)}
        />

        <ProductGrid
          products={sortedProducts}
          isLoading={isLoading}
          emptyMessage="No products found"
          emptySubMessage="Try adjusting your search or filter criteria"
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
};

export default Products;
