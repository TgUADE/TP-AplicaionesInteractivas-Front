import { Link } from "react-router-dom";
import CategoryButton from "./CategoryButton";

const CategoryNav = ({ 
  categories = [],
  selectedCategory,
  onCategoryChange,
  showAllButton = true,
  allButtonText = "All",
  linkMode = false,
  className = ""
}) => {
  const handleCategoryClick = (categoryValue) => {
    if (onCategoryChange) {
      onCategoryChange(categoryValue);
    }
  };

  // Asegurar que categories es un array válido
  const validCategories = Array.isArray(categories) ? categories : [];

  if (validCategories.length === 0) {
    return null;
  }

  return (
    <nav className={`border-b border-gray-300 mb-5 ${className}`}>
      <div className="flex justify-center gap-10 py-5 lg:gap-6 md:flex-wrap md:gap-4">
        {/* All Categories Button */}
        {showAllButton && (
          <CategoryButton
            category={{ description: allButtonText }}
            isSelected={selectedCategory === "all"}
            onClick={() => handleCategoryClick("all")}
          >
            {allButtonText}
          </CategoryButton>
        )}

        {/* Category Buttons */}
        {validCategories.map((category) => (
          linkMode ? (
            <Link
              key={category.id}
              to={`/products?category=${encodeURIComponent(category.description)}`}
              className={`${
                selectedCategory === category.description
                  ? "text-gray-800 border-b-2 border-gray-800 font-semibold"
                  : "text-gray-600 border-b-2 border-transparent font-medium hover:text-gray-800 hover:border-gray-800"
              } text-base pb-1 transition-all duration-300 no-underline`}
            >
              {category.description ? 
                category.description.charAt(0).toUpperCase() + category.description.slice(1) 
                : 'Category'}
            </Link>
          ) : (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.description}
              onClick={() => handleCategoryClick(category.description)}
            />
          )
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;