import { Link, useLocation } from "react-router-dom";
import UserIcon from "../../icons/UserIcon";
import CartIcon from "../../icons/CartIcon";
import HeartIcon from "../../icons/HeartIcon";
import SearchIcon from "../../icons/SearchIcon";
import Input from "../UI/Input";
import { useCart } from "../../hook/useCart";

const Header = () => {
  const location = useLocation();
  const { getTotalItems, isLoggedIn, cartItems } = useCart();
  
  const totalItems = getTotalItems();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-md w-full">
      <div className="w-full px-10 flex justify-between items-center h-20 lg:px-5">
        <Link
          to="/home"
          className="text-3xl font-bold text-gray-800 no-underline transition-all duration-300 hover:scale-105"
        >
          Mapple
        </Link>

        <div className="flex-1 max-w-md mx-10 lg:max-w-xs lg:mx-5">
          <Input
            placeholder="Search"
            icon={<SearchIcon />}
            className="rounded-full"
          />
        </div>

        <ul className="flex list-none m-0 p-0 gap-10 lg:gap-6">
          <li className="flex items-center">
            <Link
              to="/home"
              className={`text-gray-800 no-underline font-medium text-base transition-all duration-300 py-2 relative ${
                location.pathname === "/home"
                  ? "text-primary-500 font-semibold"
                  : "hover:text-primary-500"
              }`}
            >
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              to="/products"
              className="text-gray-800 no-underline font-medium text-base transition-all duration-300 py-2 hover:text-primary-500"
            >
              Products
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              to="/contact"
              className={`text-gray-800 no-underline font-medium text-base transition-all duration-300 py-2 relative ${
                location.pathname === "/contact"
                  ? "text-primary-500 font-semibold"
                  : "hover:text-primary-500"
              }`}
            >
              Contact Us
            </Link>
          </li>
        </ul>

        <div className="flex gap-6 items-center lg:gap-5">
          <Link
            to="/favorites"
            className="text-2xl no-underline transition-all duration-300 p-2 rounded-full hover:bg-gray-50 hover:scale-110"
          >
            <HeartIcon />
          </Link>
          <Link
            to="/cart"
            className="text-2xl no-underline transition-all duration-300 p-2 rounded-full hover:bg-gray-50 hover:scale-110"
          >
            <CartIcon 
              itemCount={cartItems.length} 
              isLocalCart={!isLoggedIn}
            />
          </Link>
          <Link
            to="/profile"
            className="text-2xl no-underline transition-all duration-300 p-2 rounded-full hover:bg-gray-50 hover:scale-110"
          >
            <UserIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;