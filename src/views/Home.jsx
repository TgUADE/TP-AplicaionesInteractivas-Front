import { useState } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/Product/ProductGrid";
import CategoryNav from "../components/Category/CategoryNav";
import { useProducts } from "../hook/useProducts";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { products, categories, isLoading, filterProductsByCategory } =
    useProducts();

  const filteredProducts = filterProductsByCategory(
    products,
    categories,
    selectedCategory
  );

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Hero Section */}
      <section 
        className="text-white flex items-center justify-center w-full h-[760px] relative overflow-hidden"
        style={{
          background: 'radial-gradient(47.03% 302.22% at 50.75% 56.73%, #F66F31 0%, #121212 100%)'
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
            <button className="bg-transparent text-white border border-white px-6 py-3 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-white hover:text-orange-500">
              Buy Now
            </button>
          </div>
          <div className="flex-1 flex justify-end items-end h-full relative">
            <img
              src="/apple-iphone-17-pro-max.png"
              alt="iPhone 17 Pro"
              className="h-[700px] w-auto object-contain object-bottom"
              style={{ 
                transform: 'translateY(50px) scale(1.3)',
                maxHeight: 'none'
              }}
            />
          </div>
        </div>
      </section>

      {/* Featured Products Banners Section */}
      <section className="bg-white w-full h-[637px] flex flex-row items-start p-0 gap-0">
        {/* Left Banners */}
        <div className="flex flex-col items-start p-0 gap-0 w-[720px] h-[637px] flex-none order-0">
          {/* Wide Square - AirPods Pro */}
          <div className="flex flex-row items-center bg-white w-[720px] h-[328px] flex-none order-0 relative" style={{padding: '0px 48px 0px 334px'}}>
            {/* AirPods Image */}
            <div 
              className="absolute h-[285px] left-[3px] right-[447px] top-0 flex-none order-0 flex-grow-0 z-0"
              style={{
                backgroundImage: 'url(/13d77c80-200b-4f73-93c9-4b78165a1806.webp)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'drop-shadow(0px 20px 3px rgba(0, 0, 0, 0.13))',
                transform: 'rotate(10deg)'
              }}
            />
            
            {/* Title + Text */}
            <div className="flex flex-col justify-center items-end p-0 gap-4 w-[338px] max-w-[404px] h-20 flex-none order-1 flex-grow z-10">
              <h3 className="w-[338px] h-10 font-medium text-[49px] leading-10 text-black flex-none order-0 self-stretch flex-grow-0">
                AirPods <span className="font-bold">Pro</span>
              </h3>
              <p className="w-[338px] h-6 font-medium text-sm leading-6 text-[#2D2B2B] flex-none order-1 self-stretch flex-grow-0">
                Listen like a Pro
              </p>
            </div>
          </div>

          {/* Squares */}
          <div className="flex flex-row items-start p-0 gap-0 w-[720px] h-[309px] flex-none order-1">
            {/* Square Banner - AirPods Max */}
            <div className="flex flex-row justify-end items-center bg-[#EDEDED] w-[360px] h-[309px] flex-none order-0 self-stretch flex-grow relative" style={{padding: '0px 48px 0px 156px'}}>
              {/* AirPods Max Image */}
              <div 
                className="absolute h-[280px] w-[180px] left-[-80px] top-[15px] flex-none order-1 flex-grow-0 z-10"
                style={{
                  backgroundImage: 'url(/Airpods_Max_single.webp)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left center'
                }}
              />
              
              {/* Title + Text */}
              <div className="flex flex-col justify-center items-center p-0 gap-0 w-40 max-w-[168px] h-[143px] flex-none order-0 flex-grow-0 z-0">
                <h3 className="w-40 h-[120px] font-light text-[29px] leading-10 text-black flex-none order-0 self-stretch flex-grow-0">
                  AirPods <span>Max</span>
                </h3>
                <p className="w-40 h-12 font-medium text-sm leading-6 text-[#919191] flex-none order-1 self-stretch flex-grow-0 -mt-20">
                  Computational audio. Listen, it's powerful
                </p>
              </div>
            </div>

            {/* Square Banner - Vision Pro */}
            <div className="flex flex-row justify-end items-center bg-[#353535] w-[360px] h-[309px] flex-none order-1 self-stretch flex-grow relative overflow-hidden" style={{padding: '0px 48px 0px 156px'}}>
              {/* Vision Pro Image */}
              <div 
              //desplazar img a la izquierda
                className="absolute flex-none order-1 flex-grow-0 z-10"
                style={{
                  backgroundImage: 'url(/vision-pro-e1711469754160.png)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left center',
                  width: '200px',
                  height: '280px',
                  left: '-90px',
                  top: '15px',
                  transform: 'scale(1.4)'
                  
                }}
              />
              
              {/* Title + Text */}
              <div className="flex flex-col justify-center items-center p-0 gap-0 w-40 max-w-[176px] h-36 flex-none order-0 flex-grow-0 z-0">
                <h3 className="w-40 h-20 font-light text-[29px] leading-10 text-white flex-none order-0 self-stretch flex-grow-0">
                  Vision <span className="font-bold">Pro</span>
                </h3>
                <p className="w-40 h-[52px] font-medium text-sm leading-6 text-[#919191] flex-none order-1 self-stretch flex-grow-0 -mt-10">
                  An immersive way to experience content
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Banner - MacBook Air */}
        <div className="flex flex-row items-center bg-[#EDEDED] w-[720px] h-[637px] flex-none order-1 flex-grow relative overflow-hidden" style={{padding: '44px 56px 44px 56px'}}>
          {/* Content */}
          <div className="flex flex-col items-start p-0 gap-4 w-[360px] max-w-[360px] h-[272px] flex-none order-0 flex-grow-0 z-10">
            {/* Title + Text */}
            <div className="flex flex-col items-start p-0 gap-1 w-[360px] h-[200px] flex-none order-0 self-stretch flex-grow-0">
              <h3 className="w-[360px] h-28 font-thin text-[64px] leading-[56px] text-black flex-none order-0 self-stretch flex-grow-0">
                Macbook Air
              </h3>
              <p className="w-[360px] h-[72px] font-medium text-sm leading-6 text-[#919191] flex-none order-1 self-stretch flex-grow-0 -mt-4">
                The new 15‑inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.
              </p>
            </div>
            
            {/* Button */}
            <button className="bg-white text-black border border-white px-10 py-10 rounded-md text-sm font-medium cursor-pointer -mt-6 transition-all duration-300 hover:bg-transparent hover:text-white-500" style={{padding: '15px 30px', gap: '3px'}}>
              
                Buy Now
              
            </button>
          </div>

          {/* MacBook Image */}
          <div className="absolute right-[-250px] bottom-0 w-[900px] h-[600px] z-0">
            <img 
              src="/mba-13inch-15inch.png" 
              alt="MacBook Air" 
              className="w-full h-full object-contain"
              style={{
                transform: 'scale(1.2)',
                objectPosition: 'bottom right'
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
            <Link
              to="/new"
              className="text-gray-800 no-underline font-semibold text-base pb-1 border-b-2 border-gray-800 transition-all duration-300 hover:text-gray-800 hover:border-gray-800"
            >
              New Arrival
            </Link>
            <Link
              to="/bestseller"
              className="text-gray-600 no-underline font-medium text-base pb-1 border-b-2 border-transparent transition-all duration-300 hover:text-gray-800 hover:border-gray-800"
            >
              Bestseller
            </Link>
            <Link
              to="/featured"
              className="text-gray-600 no-underline font-medium text-base pb-1 border-b-2 border-transparent transition-all duration-300 hover:text-gray-800 hover:border-gray-800"
            >
              Featured Products
            </Link>
          </div>
        </div>

        <ProductGrid
          products={filteredProducts}
          isLoading={isLoading}
          onAddToCart={(product) => console.log("Add to cart:", product)}
          columns={3}
        />
      </section>
    </div>
  );
};

export default Home;
