import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useCart } from "../hook/useCart";
import HeartIcon from "../icons/HeartIcon";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(id);
  const { addToCart } = useCart();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  console.log("ProductDetail - ID from params:", id);
  console.log("ProductDetail - Product:", product);
  console.log("ProductDetail - Loading:", isLoading);
  console.log("ProductDetail - Error:", error);

  useEffect(() => {
    if (!isLoading && !product && !error) {
      console.log("Product not found, redirecting to products page");
      navigate('/products');
    }
  }, [product, isLoading, error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="large" text="Loading product..." />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Mock data for colors and storage options (you can extend this based on your product data)
  const colorOptions = [
    { name: "Deep Purple", color: "#4A148C", available: true },
    { name: "Space Black", color: "#1A1A1A", available: true },
    { name: "Silver", color: "#C0C0C0", available: true },
    { name: "Gold", color: "#FFD700", available: true },
    { name: "Product Red", color: "#FF0000", available: false }
  ];

  const storageOptions = [
    { size: "128GB", price: product.currentPrice || product.price, available: true },
    { size: "256GB", price: (product.currentPrice || product.price) + 100, available: true },
    { size: "512GB", price: (product.currentPrice || product.price) + 200, available: true },
    { size: "1TB", price: (product.currentPrice || product.price) + 400, available: true }
  ];

  const getCurrentImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[selectedImageIndex].imageUrl;
    }
    return null;
  };

  const getCurrentPrice = () => {
    return storageOptions[selectedStorage]?.price || product.currentPrice || product.price;
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleAddToWishlist = () => {
    // Implement wishlist functionality
    console.log("Added to wishlist:", product.id);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
              {getCurrentImage() ? (
                <img
                  src={getCurrentImage()}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-6xl">📱</div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg border-2 p-2 transition-all duration-300 ${
                      selectedImageIndex === index 
                        ? 'border-blue-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            
            {/* Product Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${(product.currentPrice || product.price)?.toFixed(2) || "0.00"}
                </span>
                {/* Show original price if there's a discount */}
                {product.currentPrice && product.price && product.currentPrice < product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${product.price?.toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Show discount badge if there's a discount */}
              {product.currentPrice && product.price && product.currentPrice < product.price && (
                <div className="mt-2">
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.round(((product.price - product.currentPrice) / product.price) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            

        

            

            {/* Product Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 bg-white text-gray-800 border-2 border-gray-300 px-6 py-4 rounded-lg font-medium transition-all duration-300 hover:border-gray-800 flex items-center justify-center space-x-2"
                >
                  <HeartIcon />
                  <span>Add to Wishlist</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white px-6 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-gray-800"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
