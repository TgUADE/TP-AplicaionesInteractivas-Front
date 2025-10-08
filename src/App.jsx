
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./views/homeSections/Home";
import Navigation from "./views/homeSections/Navigation";
import Products from "./views/productsSections/Products";
import Login from "./views/Login";
import Register from "./views/Register";
import Contact from "./views/Contact";

function App() {
  return (
    <div id="root" className="w-full m-0 p-0 min-h-screen">
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
