import { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "Todos", icon: "🍎" },
    { id: "macbook", name: "MacBook", icon: "💻" },
    { id: "mac", name: "Mac", icon: "🖥️" },
    { id: "iphone", name: "iPhone", icon: "📱" },
    { id: "ipad", name: "iPad", icon: "📱" },
    { id: "airpods", name: "AirPods", icon: "🎧" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Apple iPhone 14 Pro Max 128GB Deep Purple",
      category: "iphone",
      price: "$900",
      image:
        "https://via.placeholder.com/300x300/663399/FFFFFF?text=iPhone+14+Pro+Max",
    },
    {
      id: 2,
      name: "Apple Watch Series 9 GPS 41mm Starlight Aluminium",
      category: "watch",
      price: "$399",
      image:
        "https://via.placeholder.com/300x300/34C759/FFFFFF?text=Apple+Watch+Series+9",
    },
    {
      id: 3,
      name: "AirPods Max Silver Starlight Aluminium",
      category: "airpods",
      price: "$549",
      image:
        "https://via.placeholder.com/300x300/FF9500/FFFFFF?text=AirPods+Max",
    },
    {
      id: 4,
      name: "Vision Pro",
      category: "vision",
      price: "$2899",
      image:
        "https://via.placeholder.com/300x300/000000/FFFFFF?text=Vision+Pro",
    },
    {
      id: 5,
      name: 'Apple iPad 9 10.2" 64GB Wi-Fi Silver (MK2L3) 2021',
      category: "ipad",
      price: "$398",
      image: "https://via.placeholder.com/300x300/FF3B30/FFFFFF?text=iPad+9",
    },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? featuredProducts
      : featuredProducts.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>iPhone 17 Pro</h1>
          <p>Created to change everything for the better. For everyone.</p>
          <button className="shop-now-btn">Shop Now</button>
        </div>
        <div className="hero-image">
          <img
            src="https://via.placeholder.com/600x600/FF6B35/FFFFFF?text=iPhone+17+Pro"
            alt="iPhone 17 Pro"
          />
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-header">
          <div className="browse-categories">
            <Link to="/categories">Browse Categories</Link>
          </div>
          <nav className="product-nav">
            <div className="product-nav-links">
              <Link to="/iphone">Iphone</Link>
              <Link to="/ipad">Ipad</Link>
              <Link to="/mac">Mac</Link>
              <Link to="/airpods">Airpods</Link>
              <Link to="/vision">Vision</Link>
              <Link to="/watch">Watch</Link>
            </div>
          </nav>
          <div className="product-filters">
            <Link to="/new" className="active">
              New Arrival
            </Link>
            <Link to="/bestseller">Bestseller</Link>
            <Link to="/featured">Featured Products</Link>
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-heart">❤️</div>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-footer">
                  <span className="product-price">{product.price}</span>
                  <button className="buy-now-btn">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-logo">
            <span className="footer-apple-logo">🍎</span>
            <span className="footer-brand">Mapple</span>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Services</h4>
              <ul>
                <li>
                  <Link to="/bonus">Bonus program</Link>
                </li>
                <li>
                  <Link to="/gift-cards">Gift cards</Link>
                </li>
                <li>
                  <Link to="/credit">Credit and payment</Link>
                </li>
                <li>
                  <Link to="/contracts">Service contracts</Link>
                </li>
                <li>
                  <Link to="/account">Non-cash account</Link>
                </li>
                <li>
                  <Link to="/payment">Payment</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Assistance to the buyer</h4>
              <ul>
                <li>
                  <Link to="/find-order">Find an order</Link>
                </li>
                <li>
                  <Link to="/delivery">Terms of delivery</Link>
                </li>
                <li>
                  <Link to="/exchange">Exchange and return of goods</Link>
                </li>
                <li>
                  <Link to="/guarantee">Guarantee</Link>
                </li>
                <li>
                  <Link to="/faq">Frequently asked questions</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of use of the site</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
