import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductGrid from "../components/Product/ProductGrid";
import CategoryNav from "../components/Category/CategoryNav";
import { useProducts } from "../hook/useProducts";
import { usePromotions } from "../hook/usePromotions";
import { useCart } from "../hook/useCart";
import HeroSection from "../components/Home/HeroSection";
import ProductBannerWideSquare from "../components/Home/ProductBanner-WideSquare";
import ProductBannerSquareLeft from "../components/Home/ProductBanner-SquareLeft";
import ProductBannerSquareRight from "../components/Home/ProductBanner-SquareRight";
import ProductBannerBigSquare from "../components/Home/ProductBanner-BigSquare";

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeSection, setActiveSection] = useState("deals");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const productsSectionRef = useRef(null);
  
  const handleBannerClick = (productId) => {
    navigate(`/product/${productId}`);
  };  const { products, categories, isLoading, filterProductsByCategory } =
    useProducts();
  const { promotionalProducts, isLoadingPromotions } = usePromotions();
  const { addToCart } = useCart();
  const filteredProducts = filterProductsByCategory(
    products,
    categories,
    selectedCategory
  );

  // Function to get products based on active section
  const getProductsToShow = () => {
    const result = (() => {
      switch(activeSection) {
        case 'deals': return promotionalProducts;
        case 'bestseller': return filteredProducts; // Show all products for now
        case 'featured': return filteredProducts; // Show all products for now
        default: return promotionalProducts;
      }
    })();
    
    return result;
  };

  // Function to get loading state based on active section
  const getLoadingState = () => {
    switch(activeSection) {
      case 'deals': return isLoadingPromotions;
      case 'bestseller': return isLoading;
      case 'featured': return isLoading;
      default: return isLoadingPromotions;
    }
  };

  const allProducts = getProductsToShow();
  
  // Pagination calculations
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Reset to page 1 when section or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSection, selectedCategory]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Hero Section */}
      <HeroSection onClick={handleBannerClick} />

      {/* Featured Products Banners Section */}
      <section className="bg-white w-full h-[637px] flex flex-row items-start p-0 gap-0">
        {/* Left Banners */}
        <div className="flex flex-col items-start p-0 gap-0 w-1/2 h-[637px] flex-none order-0">
          {/* Wide Square - AirPods Pro */}
          <ProductBannerWideSquare onClick={handleBannerClick} />

          {/* Squares */}
          <div className="flex flex-row items-start p-0 gap-0 w-full h-[309px] flex-none order-1">
            {/* Square Banner - AirPods Max */}
            <ProductBannerSquareLeft onClick={handleBannerClick} />

            {/* Square Banner - Vision Pro */}
            <ProductBannerSquareRight onClick={handleBannerClick} />
          </div>
        </div>

        {/* Big Banner - MacBook Air */}
        <ProductBannerBigSquare onClick={handleBannerClick} />
      </section>

      {/* Products Section */}
      <section ref={productsSectionRef} className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
        <div className="mb-10">
          <div className="mb-5">
            <span className="text-gray-800 underline font-medium text-lg">
              Browse Categories
            </span>
          </div>
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            linkMode={true}
            showAllButton={false}
          />
          <div className="flex gap-8 lg:gap-5">
            <button
              onClick={() => {
                setActiveSection("deals");
                setSelectedCategory("all");
              }}
              className={`font-medium text-base pb-1 border-b-2 transition-all duration-300 hover:text-gray-800 hover:border-gray-800 ${
                activeSection === "deals" 
                  ? "text-gray-800 border-gray-800 font-semibold" 
                  : "text-gray-600 border-transparent"
              }`}
            >
              Deals
            </button>
            <button
              onClick={() => {
                setActiveSection("bestseller");
                setSelectedCategory("all");
              }}
              className={`font-medium text-base pb-1 border-b-2 transition-all duration-300 hover:text-gray-800 hover:border-gray-800 ${
                activeSection === "bestseller" 
                  ? "text-gray-800 border-gray-800 font-semibold" 
                  : "text-gray-600 border-transparent"
              }`}
            >
              Bestseller
            </button>
            <button
              onClick={() => {
                setActiveSection("featured");
                setSelectedCategory("all");
              }}
              className={`font-medium text-base pb-1 border-b-2 transition-all duration-300 hover:text-gray-800 hover:border-gray-800 ${
                activeSection === "featured" 
                  ? "text-gray-800 border-gray-800 font-semibold" 
                  : "text-gray-600 border-transparent"
              }`}
            >
              Featured Products
            </button>
          </div>
        </div>

        <ProductGrid
          products={currentProducts}
          isLoading={getLoadingState()}
          onAddToCart={(product) => addToCart(product, 1)}
        />

        {/* Pagination Controls */}
        {!getLoadingState() && totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, allProducts.length)} of {allProducts.length} products
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
    </div>
  );
};

export default Home;
