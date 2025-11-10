import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavoritesContext } from "../context/FavoritesContext";
import { useAuth } from "../hook/useAuth";
import { useCart } from "../hook/useCart";
import ProductGrid from "../components/Product/ProductGrid";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Favorites = () => {
  const navigate = useNavigate();
  const { isLoggedIn, isInitialized } = useAuth();
  const { favorites, isLoading, error } = useFavoritesContext();
  const { addToCart } = useCart();

  // Redirect to auth if not logged in (only after auth is initialized)
  useEffect(() => {
    if (isInitialized && !isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, isInitialized, navigate]);


  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  // Show loading while auth is initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }

  // Will redirect to auth if not logged in
  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading favorites..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error loading favorites</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchFavorites()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <section className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            {favorites.length === 0 
              ? "You haven't added any favorites yet" 
              : `${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`
            }
          </p>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          // Custom empty state with Browse Products button
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start browsing products and click the heart icon to add them to your favorites.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          
          <ProductGrid
            products={favorites.map(favorite => ({
              ...favorite.product,
              current_price: favorite.product.current_price || favorite.product.currentPrice || favorite.product.price
            }))}
            isLoading={false} 
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Back to Products Link */}
        {favorites.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/products')}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Favorites;
