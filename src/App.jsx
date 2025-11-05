import Navigation from "./components/Layout/Navigation";
import Footer from "./components/Layout/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Routes, Route, Navigate } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";
import { useUserProfile } from "./hook/useUserProfile";
import Home from "./views/Home.jsx";
import Products from "./views/Products";
import ProductDetail from "./views/ProductDetail";
import Contact from "./views/Contact";
import Auth from "./views/Auth";
import Profile from "./views/Profile";
import Cart from "./views/Cart";
import Favorites from "./views/Favorites";
import RequireAdmin from "./components/RouteGuards/RequireAdmin";
import AdminLayout from "./components/Admin/AdminLayout";
import ProductsAdmin from "./views/Admin/ProductsAdmin";
import PromotionsAdmin from "./views/Admin/PromotionsAdmin";
import CategoriesAdmin from "./views/Admin/CategoriesAdmin";
import UsersAdmin from "./views/Admin/UsersAdmin";
import OrdersAdmin from "./views/Admin/OrdersAdmin";

function App() {
  // Ejecutar useUserProfile a nivel de app para que siempre cargue el perfil
  // y dispare el evento profile_loaded que sincroniza isAdmin automáticamente
  useUserProfile();

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
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="promotions" element={<PromotionsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
        </Route>
      </Routes>
      <Footer />
    </FavoritesProvider>
  );
}

export default App;
