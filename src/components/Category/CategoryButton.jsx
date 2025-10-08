const CategoryButton = ({ 
  category,
  isSelected = false,
  onClick,
  children,
  className = ""
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(category);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${
        isSelected
          ? "text-gray-800 border-b-2 border-gray-800 font-semibold"
          : "text-gray-600 border-b-2 border-transparent font-medium hover:text-gray-800 hover:border-gray-800"
      } text-base pb-1 transition-all duration-300 ${className}`}
    >
      {children || (category?.description ? 
        category.description.charAt(0).toUpperCase() + category.description.slice(1) 
        : 'Category')}
    </button>
  );
};

export default CategoryButton;