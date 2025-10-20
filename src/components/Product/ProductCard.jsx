import HeartIcon from "../../icons/HeartIcon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesContext } from "../../context/FavoritesContext";
import { useAuth } from "../../hook/useAuth";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    toggleFavorite,
    isFavorite,
    isLoading: favLoading,
  } = useFavoritesContext();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Ordenar imágenes por displayOrder
  const getSortedImages = () => {
    if (!product.images || product.images.length === 0) {
      return [];
    }

    // Crear una copia del array para no mutar el original
    const images = [...product.images];

    // Ordenar por displayOrder
    return images.sort((a, b) => {
      // Si ambas tienen displayOrder, ordenar por ese valor
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }

      // Si solo una tiene displayOrder, va primero
      if (a.displayOrder !== undefined) return -1;
      if (b.displayOrder !== undefined) return 1;

      // Si ninguna tiene displayOrder, mantener orden original
      return 0;
    });
  };

  const sortedImages = getSortedImages();

  const getCurrentImage = () => {
    if (sortedImages.length > 0) {
      return sortedImages[currentImageIndex].imageUrl;
    }
    return null;
  };

  const goToPreviousImage = () => {
    if (sortedImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? sortedImages.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (sortedImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === sortedImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const hasMultipleImages = sortedImages.length > 1;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on interactive elements
    if (e.target.closest("button") || e.target.closest(".heart-icon")) {
      return;
    }

    navigate(`/product/${product.id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    if (!product.id) {
      return;
    }

    await toggleFavorite(product.id);
  };

  return (
    <div
      className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 relative cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Discount Badge - Top Left Corner */}
      {product.promotion && (
        <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-2 rounded-tl-2xl rounded-br-xl text-sm font-bold z-20">
          {product.promotion.type === "PERCENTAGE"
            ? `-${product.promotion.value}%`
            : `$${product.promotion.value}`}{" "}
          off
        </div>
      )}

      <button
        className="absolute top-5 right-5 text-xl cursor-pointer z-10 heart-icon p-2 rounded-full hover:bg-white/20 transition-all duration-300"
        onClick={handleFavoriteClick}
        disabled={favLoading}
        aria-label={
          isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"
        }
      >
        <HeartIcon filled={isFavorite(product.id)} />
      </button>

      <div className="p-5">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPreviousImage();
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextImage();
                    }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
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
          <h3 className="text-lg text-gray-800 m-0 mb-4 font-medium leading-relaxed min-h-12 flex items-center justify-center">
            {product.name || "Unnamed Product"}
          </h3>
          <div className="flex flex-col items-center gap-3">
            {/* Current Price */}
            <div className="text-center min-h-[4rem]">
              <div className="text-3xl font-bold text-gray-800">
                ${product.current_price?.toFixed(2) || "0.00"}
              </div>

              {/* Original Price (crossed out if there's a promotion) */}
              {product.promotion && product.original_price && (
                <div className="text-2xl text-gray-500 line-through">
                  ${product.original_price?.toFixed(2)}
                </div>
              )}
            </div>

            <button
              onClick={async (e) => {
                e.stopPropagation();
                if (!onAddToCart) return;
                if (isAdding) return;
                setIsAdding(true);
                try {
                  await onAddToCart(product);
                } finally {
                  setIsAdding(false);
                }
              }}
              disabled={isAdding}
              className="bg-gray-900 text-white border-none px-8 py-4 rounded-lg font-medium cursor-pointer transition-all duration-300 text-base hover:bg-gray-700 w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding && (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>{isAdding ? "Adding..." : "Add to cart"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
