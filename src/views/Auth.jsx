import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Auth/AuthForm";
import Toast from "../components/UI/Toast";
import useToast from "../hook/useToast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast, showToast, dismissToast } = useToast();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("🔐 Attempting login...");
      await login({ email, password });
      console.log("✅ Login successful");
      showToast("Login successful", "success");
      
      // Esperar antes de navegar para que se vea el toast
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("❌ Login error:", error);
      showToast("Login failed: " + (error.message || "Unknown error"), "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !surname || !email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      console.log("📝 Attempting registration...");
      await register({ name, surname, email, password });
      console.log("✅ Registration successful");
      showToast("Registration successful", "success");
      
      // Esperar antes de navegar para que se vea el toast
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("❌ Registration error:", error);
      showToast("Registration failed: " + (error.message || "Unknown error"), "error");
    }
  };

  return (
    <div className="min-h-screen bg-white px-8 pt-16">
      {/* Header */}
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-semibold text-black mb-16 text-left">
          {isLogin
            ? "Sign In for checkout & other features."
            : "Create Account"}
        </h1>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-500 text-2xl font-normal">
            {isLogin ? "Sign In to Mapple Store" : "Create Account for Mapple Store"}
          </p>
        </div>
        <AuthForm
          isLogin={isLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          surname={surname}
          setSurname={setSurname}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          isLoading={isLoading}
        />
        <div className="text-center mt-8">
          <p className="text-base text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setName("");
                setSurname("");
                setEmail("");
                setPassword("");
              }}
              className="text-blue-500 hover:text-blue-600 font-normal"
            >
              {isLogin ? "Create an account." : "Sign in."}
            </button>
          </p>
        </div>
      </div>
      <Toast toast={toast} onClose={dismissToast} />
    </div>
  );
};

export default Auth;