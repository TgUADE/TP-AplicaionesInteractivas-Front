import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { isLoggedIn, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            No estás logueado
          </h1>
          <button
            onClick={() => navigate("/auth")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <section className="py-15 bg-white w-full px-10 lg:py-10 lg:px-5 md:py-8 md:px-4">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Bienvenido a tu perfil</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Información de la cuenta
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Estado:</strong> Logueado
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Token:</strong>{" "}
            {token ? `${token.substring(0, 20)}...` : "No disponible"}
          </p>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Cerrar Sesión
          </button>
        </div>
      </section>
    </div>
  );
};

export default Profile;
