import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-gray-800 text-4xl m-0 mb-2 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Apple Store
          </h1>
          <h2 className="text-gray-600 text-2xl m-0 font-normal">
            Iniciar Sesión
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-gray-800 font-semibold text-sm"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
              className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-gray-800 font-semibold text-sm"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg"
            />
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none p-4 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 mt-2 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:transform active:translate-y-0"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <p>
            ¿No tienes cuenta?
            <Link
              to="/register"
              className="text-blue-500 no-underline font-semibold transition-colors duration-300 hover:text-purple-600 hover:underline"
            >
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
