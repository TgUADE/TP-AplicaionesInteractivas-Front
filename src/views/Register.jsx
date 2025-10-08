import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

    // Validaciones
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Por favor completa todos los campos obligatorios");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Validación de email básica
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    // Aquí iría la lógica de registro con el backend
    try {
      // Simulación de registro exitoso
      console.log("Register attempt:", formData);
      setSuccess(true);

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Error al crear la cuenta. Inténtalo de nuevo.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-5">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md backdrop-blur-md">
          <div className="text-center py-10 px-5">
            <h2 className="text-green-600 text-3xl m-0 mb-4">
              ¡Cuenta creada exitosamente!
            </h2>
            <p className="text-gray-600 text-lg">Redirigiendo al login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-5">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-gray-800 text-4xl m-0 mb-2 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Apple Store
          </h1>
          <h2 className="text-gray-600 text-2xl m-0 font-normal">
            Crear Cuenta
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstName"
                className="text-gray-800 font-semibold text-sm"
              >
                Nombre *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastName"
                className="text-gray-800 font-semibold text-sm"
              >
                Apellido *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tu apellido"
                required
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-gray-800 font-semibold text-sm"
            >
              Email *
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
              htmlFor="phone"
              className="text-gray-800 font-semibold text-sm"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+54 9 11 1234-5678"
              className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-gray-800 font-semibold text-sm"
              >
                Contraseña *
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

            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirmPassword"
                className="text-gray-800 font-semibold text-sm"
              >
                Confirmar Contraseña *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg"
              />
            </div>
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
            Crear Cuenta
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <p>
            ¿Ya tienes cuenta?
            <Link
              to="/login"
              className="text-blue-500 no-underline font-semibold transition-colors duration-300 hover:text-purple-600 hover:underline"
            >
              {" "}
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
