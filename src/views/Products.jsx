import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/Product/ProductGrid";
import ProductFilters from "../components/Product/ProductFilters";
import { useCart } from "../hook/useCart";
import { useProducts } from "../hook/useProducts";
import { useCategories } from "../hook/useCategories";
import useToast from "../hook/useToast";
import Toast from "../components/UI/Toast";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const { toast, showToast, dismissToast } = useToast();
  
  const cartCallbacks = useMemo(() => ({
    onAddSuccess: () => {
      showToast("Product added to cart", "success");
    },
    onAddError: (error) => {
      showToast(error || "Failed to add product to cart", "error");
    },
  }), [showToast]);
  
  const { addToCart } = useCart(cartCallbacks);
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

  // Pagination calculations
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <section className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
        <div className="mb-4">
          <h1 className="text-4xl font-semibold text-gray-900 mb-2">Products</h1>
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
          products={currentProducts}
          isLoading={isLoading}
          emptyMessage="No products found"
          emptySubMessage="Try adjusting your search or filter criteria"
          onAddToCart={handleAddToCart}
          showToast={showToast}
        />

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg transition-colors duration-200 ${
                          currentPage === page
                            ? 'bg-black text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
      <Toast toast={toast} onClose={dismissToast} />
    </div>
  );
};

export default Products;
