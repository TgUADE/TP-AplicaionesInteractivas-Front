import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "../components/Auth/AuthForm";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true for login, false for register
  const { login, isLoggedIn, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Usar el hook para guardar el token en localStorage
        // login() automáticamente recarga la página después de 500ms
        await login(data.access_token);
        
        
      } else {
        alert("Login failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      console.log("Making POST request to register API...");
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now login.");
        setIsLogin(true); // Switch to login mode after successful registration
      } else {
        // Show detailed validation errors if available
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map(
              (error) =>
                `${error.field}: ${error.defaultMessage || error.message}`
            )
            .join("\n");
          alert("Registration failed:\n" + errorMessages);
        } else {
          alert("Registration failed: " + (data.message || "Unknown error"));
        }
      }
    } catch (error) {
      alert("Network error: " + error.message);
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
    </div>
  );
};

export default Auth;
