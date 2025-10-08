import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchIcon from "../../icons/SearchIcon";
import HeartIcon from "../../icons/HeartIcon";
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

  // Set initial category from URL parameter
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(decodeURIComponent(categoryFromUrl));
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

  // Filter and sort products
  const filteredProducts = products.filter((product) => {
    // Category matching - compare category ID since categories are objects
    let matchesCategory = selectedCategory === "all";
    if (!matchesCategory) {
      // Find the selected category object to get its ID
      const selectedCategoryObj = categories.find(cat => cat.description === selectedCategory);
      if (selectedCategoryObj && product.category) {
        // Compare the category IDs
        matchesCategory = product.category.id === selectedCategoryObj.id;
      }
    }
    
    // Search matching
    const matchesSearch = searchTerm === "" || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
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
              <Link to="/home" className="hover:text-blue-500">Home</Link>
              <span>›</span>
              <span className="text-blue-600 font-medium">{selectedCategory}</span>
            </div>
          )}
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-5">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-600">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-full bg-gray-50 text-base outline-none transition-all duration-300 focus:border-gray-800 focus:bg-white focus:shadow-lg"
                />
              </div>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex gap-4 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-base outline-none transition-all duration-300 focus:border-gray-800 focus:bg-white focus:shadow-lg"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Category Filter - Home Style */}
          <div className="mt-4 border-t pt-4">
            <nav className="border-b border-gray-300 mb-5">
              <div className="flex justify-center gap-10 py-5 lg:gap-6 md:flex-wrap md:gap-4">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`${
                    selectedCategory === "all"
                      ? "text-gray-800 border-b-2 border-gray-800 font-semibold"
                      : "text-gray-600 border-b-2 border-transparent font-medium hover:text-gray-800 hover:border-gray-800"
                  } text-base pb-1 transition-all duration-300`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.description)}
                    className={`${
                      selectedCategory === category.description
                        ? "text-gray-800 border-b-2 border-gray-800 font-semibold"
                        : "text-gray-600 border-b-2 border-transparent font-medium hover:text-gray-800 hover:border-gray-800"
                    } text-base pb-1 transition-all duration-300`}
                  >
                    {category.description ? 
                      category.description.charAt(0).toUpperCase() + category.description.slice(1) 
                      : 'Category'}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Loading products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto lg:grid-cols-2 lg:gap-6 md:grid-cols-1 md:gap-5">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative p-5 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/15"
              >
                <div className="absolute top-5 right-5 text-xl cursor-pointer z-10">
                  <HeartIcon />
                </div>
                <div className="h-60 flex items-center justify-center mb-5">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-500 text-4xl">📦</div>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-base text-gray-800 m-0 mb-4 font-medium leading-relaxed min-h-10 flex items-center justify-center">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <div className="flex justify-between items-center gap-4 md:flex-col md:gap-2">
                    <span className="text-2xl font-bold text-gray-800">
                      ${product.price || "0"}
                    </span>
                    <button className="bg-gray-800 text-white border-none px-6 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 text-sm hover:bg-primary-500 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/30 md:w-full">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Results Summary */}
        {!isLoading && (
          <div className="mt-8 text-center text-gray-600">
            <p>Showing {sortedProducts.length} of {products.length} products</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;