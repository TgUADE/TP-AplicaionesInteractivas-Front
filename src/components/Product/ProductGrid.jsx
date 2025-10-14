import ProductCard from "./ProductCard";
import LoadingSpinner from "../UI/LoadingSpinner";

const ProductGrid = ({ 
  products = [], 
  isLoading = false, 
  onAddToCart,
  columns = 3,
  emptyMessage = "No products found",
  emptySubMessage = "Try adjusting your search or filter criteria"
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

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
      
      
      <div className={`grid ${gridClasses[columns]} gap-8 max-w-6xl mx-auto lg:gap-6 md:gap-5`}>
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