import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../components/Product/ProductGrid";
import CategoryNav from "../components/Category/CategoryNav";

const URLproducts = "/api/products";
const URLcategories = "/api/categories";
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    let isMounted = true;

    fetch(URLproducts, options)
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          console.log("Products loaded:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
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
          console.log("Categories loaded:", data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: "Apple iPhone 14 Pro Max 128GB Deep Purple",
      category: "iphone",
      price: "$900",
      image:
        "https://via.placeholder.com/300x300/663399/FFFFFF?text=iPhone+14+Pro+Max",
    },
    {
      id: 2,
      name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium",
      category: "watch",
      price: "$399",
      image:
        "https://via.placeholder.com/300x300/34C759/FFFFFF?text=Apple+Watch+Series+9",
    },
    {
      id: 3,
      name: "AirPods Max Silver Starlight Aluminium",
      category: "airpods",
      price: "$549",
      image:
        "https://via.placeholder.com/300x300/FF9500/FFFFFF?text=AirPods+Max",
    },
    {
      id: 4,
      name: "Vision Pro",
      category: "vision",
      price: "$2899",
      image:
        "https://via.placeholder.com/300x300/000000/FFFFFF?text=Vision+Pro",
    },
    {
      id: 5,
      name: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
      category: "ipad",
      price: "$398",
      image: "https://via.placeholder.com/300x300/FF3B30/FFFFFF?text=iPad+9",
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? featuredProducts
      : featuredProducts.filter(
          (product) => product.category === selectedCategory
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
          onAddToCart={(product) => console.log('Add to cart:', product)}
          columns={3}
        />
      </section>
    </div>
  );
};

export default Home;
