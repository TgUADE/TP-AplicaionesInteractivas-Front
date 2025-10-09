import Navigation from "./components/Layout/Navigation";
import Footer from "./components/Layout/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/Home.jsx";
import Products from "./views/Products";
import Contact from "./views/Contact";
import Auth from "./views/Auth";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
