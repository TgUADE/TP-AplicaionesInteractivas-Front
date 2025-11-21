import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/Product/ProductGrid";
import ProductFilters from "../components/Product/ProductFilters";
import { useCart } from "../hook/useCart";
import { useProducts } from "../hook/useProducts";
import { useCategories } from "../hook/useCategories";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  const { addToCart } = useCart();
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const isLoading = productsLoading || categoriesLoading;

  const handleAddToCart = (product) => {
    // Retornar la promesa para que ProductCard pueda esperar
    return addToCart(product, 1);
  };

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

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Category matching
    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory) {
      const selectedCategoryObj = categories.find(
        (cat) => cat.description === selectedCategory
      );

      if (selectedCategoryObj) {
        // Try different possible category structures
        if (product.category_id) {
          matchesCategory = product.category_id === selectedCategoryObj.id;
        } else if (product.category && product.category.id) {
          matchesCategory = product.category.id === selectedCategoryObj.id;
        } else if (product.category_name) {
          matchesCategory = product.category_name === selectedCategoryObj.description;
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

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "deals":
        const aDiscount = (a.original_price || 0) - (a.current_price || 0);
        const bDiscount = (b.original_price || 0) - (b.current_price || 0);
        return bDiscount - aDiscount;
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
