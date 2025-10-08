import Navigation from "./components/Layout/Navigation";
import Footer from "./components/Layout/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/Home.jsx";
import Products from "./views/Products";
import Login from "./views/Login";
import Register from "./views/Register";
import Contact from "./views/Contact";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
