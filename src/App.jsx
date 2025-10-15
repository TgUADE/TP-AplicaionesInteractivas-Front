import Navigation from "./components/Layout/Navigation";
import Footer from "./components/Layout/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Routes, Route, Navigate } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import Home from "./views/Home.jsx";
import Products from "./views/Products";
import ProductDetail from "./views/ProductDetail";
import Contact from "./views/Contact";
import Auth from "./views/Auth";
import Profile from "./views/Profile";
import Cart from "./views/Cart";
import Favorites from "./views/Favorites";

function App() {
  return (
    <FavoritesProvider>
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      <Footer />
    </FavoritesProvider>
  );
}

export default App;
