import Input from "../UI/Input";
import SearchIcon from "../../icons/SearchIcon";

const ProductSearch = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search products...",
  className = ""
}) => {
  return (
    <div className={`flex-1 max-w-md ${className}`}>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={onSearchChange}
        icon={<SearchIcon />}
        className="rounded-full"
      />
    </div>
  );
};

export default ProductSearch;