import HeartIcon from "../../icons/HeartIcon";
import { useState } from "react";

const ProductCard = ({ product, onAddToCart }) => {
  console.log("En product card", product);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getCurrentImage = () => {
    if (product.images && product.images.length > 0) {
      return product.images[currentImageIndex].imageUrl;
    }
    return null;
  };

  const goToPreviousImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative p-5 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/15">
      <div className="absolute top-5 right-5 text-xl cursor-pointer z-10">
        <HeartIcon />
      </div>
      <div className="h-60 flex items-center justify-center mb-5 relative group">
        {getCurrentImage() ? (
          <>
            <img
              src={getCurrentImage()}
              alt={product.name}
              className="max-w-full max-h-full object-contain transition-all duration-300"
            />

            {/* Navigation Arrows - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                {/* Left Arrow */}
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Right Arrow */}
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                  aria-label="Next image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
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
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            className="bg-gray-800 text-white border-none px-6 py-3 rounded-full font-semibold cursor-pointer transition-all duration-300 text-sm hover:bg-primary-500 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/30 md:w-full"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
