import ProductSearch from "./ProductSearch";
import CategoryNav from "../Category/CategoryNav";
import LoadingSpinner from "../UI/LoadingSpinner";

const ProductFilters = ({
  // Search props
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search products...",
  
  // Category props
  categories = [],
  selectedCategory,
  onCategoryChange,
  isLoadingCategories = false,
  
  // Sort props
  sortBy,
  onSortChange,
  sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'deals', label: 'Deals' }
  ],
  
  className = ""
}) => {
  return (
    <div className={`mb-10 ${className}`}>
      {/* Search and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-5">
        <ProductSearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        
        {/* Sort Dropdown */}
        <div className="flex gap-4 items-center">
          <select
            value={sortBy}
            onChange={onSortChange}
            className="px-4 py-3 border border-gray-300 rounded-full bg-gray-50 text-base outline-none transition-all duration-300 focus:border-gray-800 focus:bg-white focus:shadow-lg"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories */}
      
      
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      
    </div>
  );
};

export default ProductFilters;