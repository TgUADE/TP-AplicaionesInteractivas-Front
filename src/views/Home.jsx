import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductGrid from "../components/Product/ProductGrid";
import CategoryNav from "../components/Category/CategoryNav";
import { useProducts } from "../hook/useProducts";
import { usePromotions } from "../hook/usePromotions";
import { useCart } from "../hook/useCart";

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeSection, setActiveSection] = useState("deals"); // "deals", "bestseller", "featured"
  
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
      <section
        className="text-white flex items-center justify-center w-full h-[760px] relative overflow-hidden"
        style={{
          background:
            "radial-gradient(47.03% 302.22% at 50.75% 56.73%, #F66F31 0%, #121212 100%)",
        }}
      >
        <div className="flex items-center justify-between w-full max-w-7xl px-16 gap-16">
          <div className="flex-1 pr-8">
            <h1 className="text-8xl font-thin m-0 mb-6 leading-none text-white whitespace-nowrap">
              iPhone 17 <span className="font-bold">Pro</span>
            </h1>
            <p className="text-lg m-0 mb-8 opacity-90 leading-relaxed font-light max-w-lg">
              Created to change everything for the better. For everyone.
            </p>
            <button 
            onClick={() => handleBannerClick("250bbd60-28b4-4328-8e03-2aed5a8b7e0a")} 
            className="bg-transparent text-white border border-white px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-white hover:text-orange-500">
              Buy Now
            </button>
          </div>
          <div className="flex-1 flex justify-end items-end h-full relative">
            <img
              src="/apple-iphone-17-pro-max.png"
              alt="iPhone 17 Pro"
              className="h-[700px] w-auto object-contain object-bottom"
              style={{
                transform: "translateY(50px) scale(1.3)",
                maxHeight: "none",
              }}
            />
          </div>
        </div>
      </section>

      {/* Featured Products Banners Section */}
      <section className="bg-white w-full h-[637px] flex flex-row items-start p-0 gap-0">
        {/* Left Banners */}
        <div className="flex flex-col items-start p-0 gap-0 w-1/2 h-[637px] flex-none order-0">
          {/* Wide Square - AirPods Pro */}
          <div 
            onClick={() => handleBannerClick("ddba688a-9891-40a4-a449-b5f6266eeb70")} 
            className="cursor-pointer flex flex-row items-center justify-between bg-white w-full h-[328px] flex-none order-0 relative px-8 lg:px-4 md:px-2"
          >
            {/* AirPods Image */}
            <div className="flex-1 flex justify-center items-center h-full lg:flex-[0.8] md:flex-[0.7]">
              <div
                className="h-[285px] w-[270px] flex-none z-0 xl:h-[240px] xl:w-[230px] lg:h-[200px] lg:w-[190px] md:h-[160px] md:w-[150px] sm:h-[130px] sm:w-[120px]"
                style={{
                  backgroundImage:
                    "url(/13d77c80-200b-4f73-93c9-4b78165a1806.webp)",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  filter: "drop-shadow(0px 20px 3px rgba(0, 0, 0, 0.13))",
                  transform: "rotate(10deg)",
                }}
              />
            </div>

            {/* Title + Text */}
            <div className="flex-1 flex flex-col justify-center items-center gap-4 h-full z-10 px-4 lg:px-2 md:px-1">
              <h3 className="font-medium text-[56px] leading-[52px] text-black text-center 2xl:text-[56px] xl:text-[48px] lg:text-[40px] md:text-[32px] sm:text-[28px] 2xl:leading-[52px] xl:leading-[46px] lg:leading-[40px] md:leading-[32px] sm:leading-[28px]">
                AirPods <span className="font-bold">Pro</span>
              </h3>
              <p className="font-medium text-base leading-6 text-[#2D2B2B] text-center lg:text-sm md:text-xs sm:text-[10px]">
                Listen like a Pro
              </p>
            </div>
          </div>

          {/* Squares */}
          <div className="flex flex-row items-start p-0 gap-0 w-full h-[309px] flex-none order-1">
            {/* Square Banner - AirPods Max */}
            <div 
            onClick={() => handleBannerClick("cb82397b-7313-4e0f-b7a6-2c3d6695cb16")} 
            className="cursor-pointer flex flex-row justify-center items-center bg-[#EDEDED] w-1/2 h-[309px] flex-none order-0 self-stretch flex-grow relative overflow-hidden">
              {/* AirPods Max Image */}
              <div
                className="absolute h-[280px] w-[180px] left-[-80px] top-[15px] flex-none order-1 flex-grow-0 z-10 xl:h-[240px] xl:w-[160px] xl:left-[-70px] lg:h-[200px] lg:w-[140px] lg:left-[-60px] md:h-[160px] md:w-[120px] md:left-[-50px] sm:h-[130px] sm:w-[100px] sm:left-[-40px]"
                style={{
                  backgroundImage: "url(/Airpods_Max_single.webp)",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left center",
                }}
              />

              {/* Title + Text */}
              <div className="flex flex-col justify-center items-center p-0 gap-2 flex-none order-0 flex-grow-0 z-0 ml-16 mr-8 xl:ml-12 lg:ml-10 md:ml-8 sm:ml-6 xl:mr-6 lg:mr-4 md:mr-3 sm:mr-2">
                <h3 className="font-light text-[36px] leading-9 text-black text-center xl:text-[32px] lg:text-[28px] md:text-[24px] sm:text-[20px] xl:leading-8 lg:leading-7 md:leading-6 sm:leading-5">
                  AirPods <span>Max</span>
                </h3>
                <p className="font-medium text-base leading-5 text-[#919191] text-center max-w-[160px] lg:text-sm md:text-xs sm:text-[10px] lg:max-w-[140px] md:max-w-[120px] sm:max-w-[100px]">
                  Computational audio. Listen, it's powerful
                </p>
              </div>
            </div>

            {/* Square Banner - Vision Pro */}
            <div 
            onClick={() => handleBannerClick("de7f3bf8-3111-4cf7-8030-7e085511a69a")}
            className="cursor-pointer flex flex-row justify-center items-center bg-[#353535] w-1/2 h-[309px] flex-none order-1 self-stretch flex-grow relative overflow-hidden">
              {/* Vision Pro Image */}
              <div
                className="absolute flex-none order-1 flex-grow-0 z-10 xl:!w-[180px] xl:!h-[250px] xl:!left-[-80px] lg:!w-[160px] lg:!h-[220px] lg:!left-[-70px] md:!w-[140px] md:!h-[190px] md:!left-[-60px] sm:!w-[120px] sm:!h-[160px] sm:!left-[-50px]"
                style={{
                  backgroundImage: "url(/vision-pro-e1711469754160.png)",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left center",
                  width: "200px",
                  height: "280px",
                  left: "-90px",
                  top: "15px",
                  transform: "scale(1.4)",
                }}
              />

              {/* Title + Text */}
              <div className="flex flex-col justify-center items-center p-0 gap-2 flex-none order-0 flex-grow-0 z-0 ml-16 mr-8 xl:ml-12 lg:ml-10 md:ml-8 sm:ml-6 xl:mr-6 lg:mr-4 md:mr-3 sm:mr-2">
                <h3 className="font-light text-[36px] leading-9 text-white text-center xl:text-[32px] lg:text-[28px] md:text-[24px] sm:text-[20px] xl:leading-8 lg:leading-7 md:leading-6 sm:leading-5">
                  Vision <span className="font-bold">Pro</span>
                </h3>
                <p className="font-medium text-base leading-5 text-[#919191] text-center max-w-[160px] lg:text-sm md:text-xs sm:text-[10px] lg:max-w-[140px] md:max-w-[120px] sm:max-w-[100px]">
                  An immersive way to experience content
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Banner - MacBook Air */}
        <div
          className="flex flex-row items-center bg-[#EDEDED] w-[720px] h-[637px] flex-none order-1 flex-grow relative overflow-hidden"
          style={{ padding: "44px 20px 44px 120px" }}
        >
          {/* Content - Left Side */}
          <div className="flex flex-col items-start justify-center gap-4 w-[280px] max-w-[280px] flex-none z-20 relative bg-[#EDEDED] pr-4 2xl:w-[300px] 2xl:max-w-[300px] xl:w-[260px] xl:max-w-[260px] lg:w-[220px] lg:max-w-[220px] md:w-[180px] md:max-w-[180px] sm:w-[160px] sm:max-w-[160px] xl:gap-3 lg:gap-3 md:gap-2 sm:gap-2">
            {/* Title + Text */}
            <div className="flex flex-col items-start gap-3 w-full xl:gap-2 lg:gap-2 md:gap-2 sm:gap-1">
              <h3 className="font-thin text-[72px] leading-[64px] text-black 2xl:text-[72px] xl:text-[60px] lg:text-[52px] md:text-[42px] sm:text-[36px] 2xl:leading-[64px] xl:leading-[56px] lg:leading-[48px] md:leading-[40px] sm:leading-[36px]">
                Macbook Air
              </h3>
              <p className="font-medium text-base leading-6 text-[#919191] lg:text-sm md:text-xs sm:text-[10px] lg:leading-5 md:leading-4 sm:leading-3">
                The new 15‑inch MacBook Air makes room for more of what you love
                with a spacious Liquid Retina display.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => handleBannerClick("d442976f-7032-42d5-948d-3200298d89af")}
              className="bg-white text-black border border-white px-10 py-4 rounded-md text-base font-medium cursor-pointer transition-all duration-300 hover:bg-transparent hover:text-black lg:px-8 lg:py-3 lg:text-sm md:px-6 md:py-2 md:text-xs sm:px-4 sm:py-2 sm:text-[10px]"
              style={{ padding: "16px 32px" }}
            >
              Buy Now
            </button>
          </div>

          {/* MacBook Image */}
          <div className="absolute right-[-250px] bottom-0 w-[900px] h-[600px] z-0 xl:right-[-280px] xl:w-[800px] xl:h-[550px] lg:right-[-300px] lg:w-[700px] lg:h-[500px] md:right-[-320px] md:w-[600px] md:h-[450px] sm:right-[-340px] sm:w-[500px] sm:h-[400px]">
            <img
              src="/mba-13inch-15inch.png"
              alt="MacBook Air"
              className="w-full h-full object-contain"
              style={{
                transform: "scale(1.2)",
                objectPosition: "bottom right",
              }}
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
        <div className="mb-10">
          <div className="mb-5">
            <Link
              to="/categories"
              className="text-gray-800 underline font-medium text-lg"
            >
              Browse Categories
            </Link>
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
