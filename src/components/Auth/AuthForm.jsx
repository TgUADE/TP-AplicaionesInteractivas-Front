import MailIcon from "../../icons/MailIcon";
import LockIcon from "../../icons/LockIcon";
import Input from "../UI/Input";
import Button from "../UI/Button";
const AuthForm = ({ isLogin, email, setEmail, password, setPassword, name, setName, surname, setSurname, handleLogin, handleRegister }) => {
    return (
                <form
        className="space-y-6"
        onSubmit={isLogin ? handleLogin : handleRegister}
        >
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

          {/* Email field */}
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
          {/* Password field  */}
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
    );
};
export default AuthForm;