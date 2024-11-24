import { useState } from "react";
import { Button } from "../ui/button";
import { Evvi_new, LoginImg } from "@/assets/Index";
import { Input } from "../ui/input";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import Instance from "../../API/Instance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useNavigate } from "react-router";
// import { Router } from "react-router";

const Login = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Instance.post("/admin/login", { mail, password });
      if (response.status === 200 && response.data.status) {
        localStorage.setItem("token", response.data.token);
        console.log(response.data);

        toast.success(
          response.data.message ||
            "Login successful! Redirecting to the dashboard..."
        );
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 1000);
      } else if (response.status === 404 && response.data.status) {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while trying to login.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="hidden md:flex w-[73%] h-full">
        <img
          src={LoginImg}
          alt="Login Illustration"
          className="w-full object-cover"
        />
      </div>

      {/* Login Form Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-[27%] p-4">
        <div className="w-32 flex justify-center mb-4">
          <img src={Evvi_new} alt="Evvi Logo" className="w-full h-auto" />
        </div>

        <div className="w-full flex flex-col gap-3 items-center justify-center">
          <h1 className="text-center font-bold text-2xl">Login</h1>
          <p className="text-sm font-semibold max-w-xs text-center mb-8">
            Hey, enter your details to sign in to your account.
          </p>

          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Enter Email"
                className="focus:border-primary"
                aria-label="Email Address"
                required
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />

              {/* Password Input with Eye Toggle */}
              <div className="relative">
                <Input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Enter Your Password"
                  aria-label="Password"
                  className="pr-10 focus:border-primary"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={
                    isPasswordVisible ? "Hide password" : "Show password"
                  }
                >
                  {isPasswordVisible ? (
                    <FaRegEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm font-semibold">
              Having trouble signing in?{" "}
              <span className="text-primary cursor-pointer">
                Forget password
              </span>
            </p>

            <Button className="w-full" onClick={handleSubmit}>
              Sign In
            </Button>
          </div>

          <p className="text-sm text-center mt-4">
            Don&apos;t have an account?{" "}
            <span className="font-semibold text-primary cursor-pointer">
              Request Now
            </span>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
