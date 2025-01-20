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

const UserLogin = () => {
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
      const response = await Instance.post("/user/login", { mail, password });
      if (response.status === 200 && response.data.status) {
        if (response.data.data.role !== "admin") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", JSON.stringify(response.data.data.role));
          localStorage.setItem("name", JSON.stringify(response.data.data.name));
          localStorage.setItem("mail", JSON.stringify(response.data.data.mail));
          toast.success(response.data.message);
        } else {
          toast.error("Unauthenticated");
        }
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message ||
          "An error occurred while trying to login."
      );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="hidden md:flex h-screen w-1/2">
        <img src={LoginImg} alt="Login Illustration" className="object-cover" />
      </div>

      {/* Login Form Section */}
      <div className="flex flex-col items-center justify-center w-1/3 max-2xl:w-1/3 m-auto p-4">
        <div className="w-[80%] items-center justify-center ">
          <div className="w-32 flex justify-center m-auto mb-4">
            <img src={Evvi_new} alt="Evvi Logo" className="w-full h-auto" />
          </div>

          <div className="w-full flex flex-col gap-3 items-center justify-center">
            <h1 className="text-center font-bold text-2xl">Login</h1>
            <p className="text-sm font-semibold  text-center mb-8">
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserLogin;
