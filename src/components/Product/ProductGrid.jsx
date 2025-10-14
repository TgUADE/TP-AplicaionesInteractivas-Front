import ProductCard from "./ProductCard";
import LoadingSpinner from "../UI/LoadingSpinner";

const ProductGrid = ({ 
  products = [], 
  isLoading = false, 
  onAddToCart,
  emptyMessage = "No products found",
  emptySubMessage = "Try adjusting your search or filter criteria"
}) => {
  // Responsive grid classes - adapts automatically to screen size with better proportions
  const responsiveGridClasses = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  // Show loading spinner while loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" text="Loading products..." />
      </div>
    );
  }

  // Show empty state only when not loading and no products
  if (!isLoading && products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">{emptySubMessage}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      
      
      <div className={`grid ${responsiveGridClasses} gap-6 mx-auto px-6 lg:gap-5 md:gap-4`}>
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;