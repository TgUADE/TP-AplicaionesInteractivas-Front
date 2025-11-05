import { useState } from "react";
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
  const handleBannerClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const { products, categories, isLoading, filterProductsByCategory } =
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
      <section className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
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
          products={getProductsToShow()}
          isLoading={getLoadingState()}
          onAddToCart={(product) => addToCart(product.id, 1)}
        />
      </section>
    </div>
  );
};

export default Home;
