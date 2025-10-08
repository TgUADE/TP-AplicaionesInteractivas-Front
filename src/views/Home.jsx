import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const URLproducts = "api/products";
const URLcategories = "api/categories";
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
          <button className="bg-orange-500 text-white border-2 border-white px-9 py-4 rounded-lg text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-white hover:text-orange-500 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
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
          <nav className="border-b border-gray-300 mb-5">
            <div className="flex justify-center gap-10 py-5 lg:gap-6 md:flex-wrap md:gap-4">
              <Link
                to="/iphone"
                className="text-gray-800 no-underline font-medium text-base transition-colors duration-300 hover:text-primary-500"
              >
                Iphone
              </Link>
              <Link
                to="/ipad"
                className="text-gray-800 no-underline font-medium text-base transition-colors duration-300 hover:text-primary-500"
              >
                Ipad
              </Link>
              <Link
                to="/mac"
                className="text-gray-800 no-underline font-medium text-base transition-colors duration-300 hover:text-primary-500"
              >
                Mac
              </Link>
              <Link
                to="/airpods"
                className="text-gray-800 no-underline font-medium text-base transition-colors duration-300 hover:text-primary-500"
              >
                Airpods
              </Link>
              <Link
                to="/vision"
                className="text-gray-800 no-underline font-medium text-base transition-colors duration-300 hover:text-primary-500"
              >
                Vision
              </Link>
              <Link
                to="/watch"
                className="text-gray-800 no-underline font-medium text-base transition-colors duration-300 hover:text-primary-500"
              >
                Watch
              </Link>
            </div>
          </nav>
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

        <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto lg:grid-cols-2 lg:gap-6 md:grid-cols-1 md:gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative p-5 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/15"
            >
              <div className="absolute top-5 right-5 text-xl cursor-pointer z-10">
                ❤️
              </div>
              <div className="h-60 flex items-center justify-center mb-5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-center">
                <h3 className="text-base text-gray-800 m-0 mb-4 font-medium leading-relaxed min-h-10 flex items-center justify-center">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center gap-4 md:flex-col md:gap-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {product.price}
                  </span>
                  <button className="bg-gray-800 text-white border-none px-6 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 text-sm hover:bg-primary-500 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/30 md:w-full">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-15 px-10 w-full lg:py-10 lg:px-5 md:py-8 md:px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-start lg:flex-col lg:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍎</span>
            <span className="text-3xl font-bold text-white">Mapple</span>
          </div>

          <div className="flex gap-20 lg:gap-10 md:flex-col md:gap-8">
            <div className="flex flex-col gap-5">
              <h4 className="text-lg font-bold m-0 mb-5 text-white">
                Services
              </h4>
              <ul className="list-none m-0 p-0">
                <li className="mb-2">
                  <Link
                    to="/bonus"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Bonus program
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/gift-cards"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Gift cards
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/credit"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Credit and payment
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/contracts"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Service contracts
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/account"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Non-cash account
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/payment"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Payment
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h4 className="text-lg font-bold m-0 mb-5 text-white">
                Assistance to the buyer
              </h4>
              <ul className="list-none m-0 p-0">
                <li className="mb-2">
                  <Link
                    to="/find-order"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Find an order
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/delivery"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Terms of delivery
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/exchange"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Exchange and return of goods
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/guarantee"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Guarantee
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/faq"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Frequently asked questions
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/terms"
                    className="text-white no-underline text-sm transition-colors duration-300 hover:text-primary-500"
                  >
                    Terms of use of the site
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
