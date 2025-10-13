import { Link, useLocation } from "react-router-dom";
import UserIcon from "../../icons/UserIcon";
import CartIcon from "../../icons/CartIcon";
import HeartIcon from "../../icons/HeartIcon";
import SearchIcon from "../../icons/SearchIcon";
import { useCart } from "../../hook/useCart";

const Navigation = () => {
  const location = useLocation();
  const { cartItemCount, isLocalCart } = useCart();

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-md w-full">
        <div className="w-full px-10 flex justify-between items-center h-20 lg:px-5">
          <Link
            to="/home"
            className="flex items-center gap-3 text-4xl font-bold text-gray-800 no-underline transition-all duration-300"
          >
            <img
              src="/mapple-logo.png"
              alt="Mapple Logo"
              className="w-12 h-12 object-contain"
            />
            Mapple
          </Link>

          <div className="flex-1 max-w-md mx-10 lg:max-w-xs lg:mx-5">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-600">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search"
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-full bg-gray-50 text-base outline-none transition-all duration-300 focus:border-gray-800 focus:bg-white focus:shadow-lg"
              />
            </div>
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
                className={`text-gray-800 no-underline font-medium text-base transition-all duration-300 py-2 relative ${
                  location.pathname === "/products"
                    ? "text-primary-500 font-semibold"
                    : "hover:text-primary-500"
                }`}
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
              to="/wishlist"
              className="text-2xl no-underline transition-all duration-300 p-2 rounded-full hover:bg-gray-50"
            >
              <HeartIcon />
            </Link>
            <Link
              to="/cart"
              className="text-2xl no-underline transition-all duration-300 p-2 rounded-full hover:bg-gray-50 relative"
            >
              <CartIcon itemCount={cartItemCount} isLocalCart={isLocalCart} />
            </Link>
            <Link
              to="/profile"
              className="text-2xl no-underline transition-all duration-300 p-2 rounded-full hover:bg-gray-50 "
            >
              <UserIcon />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
