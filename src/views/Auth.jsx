import { useState } from 'react'
import Input from '../components/UI/Input'
import Button from '../components/UI/Button'
import LockIcon from '../icons/LockIcon'
import MailIcon from '../icons/MailIcon'

const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [token, setToken] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLogin, setIsLogin] = useState(true) // true for login, false for register

    const handleLogin = async (e) => {
        e.preventDefault();
        
        console.log("=== LOGIN ATTEMPT ===");
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Request body:", JSON.stringify({ email, password }));

        try {
            console.log("Making POST request to API...");
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });
            
            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);
            
            const data = await response.json();
            console.log("Response data:", data);
            
            if (response.ok) {
                console.log("Login successful! Token received:", data.token);
                setToken(data.token);
                setIsLoggedIn(true);
                console.log("Token saved to state");
            } else {
                console.error("Login failed:", data.message);
                alert("Login failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Network error or other issue:", error);
            alert("Network error: " + error.message);
        }
        
        console.log("=== END LOGIN ATTEMPT ===");
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        console.log("=== REGISTER ATTEMPT ===");
        console.log("Name:", name);
        console.log("Surname:", surname);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Request body:", JSON.stringify({ name, surname, email, password }));

        try {
            console.log("Making POST request to register API...");
            const response = await fetch("/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, surname, email, password })
            });
            
            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);
            
            const data = await response.json();
            console.log("Response data:", data);
            
            if (response.ok) {
                console.log("Registration successful!");
                alert("Registration successful! You can now login.");
                setIsLogin(true); // Switch to login mode after successful registration
            } else {
                console.error("Registration failed:", data.message);
                console.error("Full error data:", data);
                
                // Show detailed validation errors if available
                if (data.errors && Array.isArray(data.errors)) {
                    const errorMessages = data.errors.map(error => 
                        `${error.field}: ${error.defaultMessage || error.message}`
                    ).join('\n');
                    alert("Registration failed:\n" + errorMessages);
                } else {
                    alert("Registration failed: " + (data.message || "Unknown error"));
                }
            }
        } catch (error) {
            console.error("Network error or other issue:", error);
            alert("Network error: " + error.message);
        }
        
        console.log("=== END REGISTER ATTEMPT ===");
    };

    

    return (
        <div className="min-h-screen bg-white px-8 pt-16">
            {/* Header */}
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-semibold text-black mb-16 text-left">
                    {isLogin ? "Sign In for checkout." : "Create Account"}
                </h1>
            </div>
            
            {/* Form Container */}
            <div className="w-full max-w-md mx-auto">
                
                <div className="text-center mb-12">
                    <p className="text-gray-500 text-2xl font-normal">
                        {isLogin ? "Sign In to Mapple Store" : "Sign In to Mapple Store"}
                    </p>
                </div>

                <form className="space-y-6" onSubmit={isLogin ? handleLogin : handleRegister}>
                    {!isLogin && (
                        <>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="First Name"
                                    className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    placeholder="Last Name"
                                    className="w-full h-14 px-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400"
                                    required
                                />
                            </div>
                        </>
                    )}
                    
                    
                    
                    {/* Email field second (as shown in image) */}
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">
                            <MailIcon />
                        </div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full h-14 pl-14 pr-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400"
                            required
                        />
                    </div>
                    {/* Password field first (as shown in image) */}
                    <div className="relative">
                        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">
                            <LockIcon />
                        </div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full h-14 pl-14 pr-6 rounded-full border-2 border-gray-300 bg-white focus:bg-white focus:border-gray-400 focus:ring-0 text-base placeholder-gray-400"
                            required
                        />
                    </div>
                    
                    <div className="pt-6">
                        <Button
                            type="submit"
                            className="w-full h-14 bg-black text-white rounded-full hover:bg-gray-800 text-base font-medium"
                        >
                            {isLogin ? "Login" : "Create Account"}
                        </Button>
                    </div>
                    
                </form>

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

                {isLoggedIn && token && (
                    <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-full">
                        <p className="text-green-700 font-medium text-center">Login Successful!</p>
                        <p className="text-xs text-green-600 mt-1 text-center">Token received</p>
                    </div>
                )}
            </div>
        </div>
    )
        
       

                
    
};

export default Auth;
