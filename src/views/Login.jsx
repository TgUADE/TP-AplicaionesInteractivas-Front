import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Aquí iría la lógica de autenticación con el backend
    try {
      // Simulación de login exitoso
      console.log("Login attempt:", formData);
      // Por ahora, redirigimos a home
      navigate("/home");
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Apple Store</h1>
          <h2>Iniciar Sesión</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿No tienes cuenta?
            <Link to="/register" className="link">
              {" "}
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
