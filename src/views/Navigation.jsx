import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/home" className="nav-logo">
            🍎 Mapple
          </Link>

          <div className="nav-search">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search"
                className="search-input"
              />
            </div>
          </div>

          <ul className="nav-menu">
            <li className="nav-item">
              <Link
                to="/home"
                className={`nav-link ${
                  location.pathname === "/home" ? "active" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact"
                className={`nav-link ${
                  location.pathname === "/contact" ? "active" : ""
                }`}
              >
                Contact Us
              </Link>
            </li>
          </ul>

          <div className="nav-icons">
            <Link to="/wishlist" className="nav-icon">
              ❤️
            </Link>
            <Link to="/cart" className="nav-icon">
              🛒
            </Link>
            <Link to="/profile" className="nav-icon">
              👤
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
