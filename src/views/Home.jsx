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
      <section className="bg-gradient-to-br from-orange-500 to-black text-white py-24 px-10 flex items-center justify-between min-h-[80vh] w-full lg:flex-col lg:text-center lg:py-15 lg:px-10">
        <div className="flex-1 max-w-2xl pr-15 lg:pr-0 lg:mb-10">
          <h1 className="text-8xl font-bold m-0 mb-8 leading-tight text-white lg:text-6xl md:text-5xl">
            iPhone 17 Pro
          </h1>
          <p className="text-2xl m-0 mb-10 opacity-90 leading-relaxed lg:text-xl md:text-lg">
            Created to change everything for the better. For everyone.
          </p>
          <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:text-orange-500 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
            Shop Now
          </button>
        </div>
        <div className="flex-1 text-center relative">
          <img
            src="https://via.placeholder.com/600x600/FF6B35/FFFFFF?text=iPhone+17+Pro"
            alt="iPhone 17 Pro"
            className="max-w-full h-auto max-h-96 object-contain"
          />
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
