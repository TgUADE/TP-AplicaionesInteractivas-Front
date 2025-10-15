import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserIcon from "../../icons/UserIcon";
import CartIcon from "../../icons/CartIcon";
import HeartIcon from "../../icons/HeartIcon";
import SearchIcon from "../../icons/SearchIcon";
import { useCart } from "../../hook/useCart";
import { useFavoritesContext } from "../../context/FavoritesContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItemCount, isLocalCart } = useCart();
  const { favorites } = useFavoritesContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navLinkClass = (path) => 
    `text-gray-800 no-underline font-medium text-base transition-all duration-300 py-2 relative ${
      location.pathname === path
        ? "text-primary-500 font-semibold"
        : "hover:text-primary-500"
    }`;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 flex justify-between items-center h-16 sm:h-20">
        
        {/* Logo - responsive */}
        <Link
          to="/home"
          className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-4xl font-bold text-gray-800 no-underline transition-all duration-300"
        >
          <img
            src="/mapple-logo.png"
            alt="Mapple Logo"
            
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            
          />
          <span className="hidden sm:block">Mapple</span>
        </Link>

        {/* Barra de búsqueda - oculta en móvil */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-10">
          <form onSubmit={handleSearch} className="relative w-full">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-600">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-full bg-gray-50 text-base outline-none transition-all duration-300 focus:border-gray-800 focus:bg-white focus:shadow-lg"
            />
          </form>
        </div>

        {/* Menú desktop - oculto en móvil */}
        <ul className="hidden lg:flex list-none m-0 p-0 gap-6 xl:gap-10">
          <li className="flex items-center">
            <Link to="/home" className={navLinkClass("/home")}>
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/products" className={navLinkClass("/products")}>
              Products
            </Link>
          </li>
          <li className="flex items-center">
            <Link to="/contact" className={navLinkClass("/contact")}>
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Iconos - siempre visibles pero adaptados */}
        <div className="flex gap-2 sm:gap-4 lg:gap-6 items-center">
          {/* Búsqueda móvil */}
          <button className="md:hidden text-xl p-2 rounded-full hover:bg-gray-50 transition-all duration-300">
            <SearchIcon />
          </button>
          
          <Link
            to="/favorites"
            className="text-xl sm:text-2xl p-1 sm:p-2 rounded-full hover:bg-gray-50 relative transition-all duration-300"
          >
            <HeartIcon />
            
          
          </Link>
          <Link
            to="/cart"
            className="text-xl sm:text-2xl p-1 sm:p-2 rounded-full hover:bg-gray-50 relative transition-all duration-300"
          >
            <CartIcon itemCount={cartItemCount} isLocalCart={isLocalCart} />
          </Link>
          <Link
            to="/profile"
            className="text-xl sm:text-2xl p-1 sm:p-2 rounded-full hover:bg-gray-50 transition-all duration-300"
          >
            <UserIcon />
          </Link>

          {/* Botón hamburguesa */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-2xl p-2 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-gray-800 mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 py-4 bg-white border-t border-gray-100">
          {/* Búsqueda móvil expandida */}
          <div className="md:hidden mb-4">
            <form onSubmit={handleSearch} className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full py-2 px-3 pl-10 border border-gray-300 rounded-lg text-sm outline-none focus:border-gray-800 transition-all duration-300"
              />
            </form>
          </div>
          
          {/* Enlaces móviles */}
          <ul className="space-y-1">
            <li>
              <Link 
                to="/home" 
                className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/products" 
                className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className="block py-3 px-2 text-gray-800 font-medium hover:bg-gray-50 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
