import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/context";
import { db } from "../../db";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const { setCurrentUser, setCurrentUserRole, setIsLogin, setActiveTab } =
    useContext(UserContext);

  const [isPassVisible, setIsPassVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username == "" || formData.password == "") {
      toast.warning("Please Enter data");
      return;
    }

    const payload = formData;

    const sendLoginData = async () => {
      await axios
        .post("http://localhost:5000/login", payload)
        .then((res) => {
          if (res.data.isLoginSuccess) {
            toast.success("Login successful");
            setCurrentUser(res.data.user);
            setCurrentUserRole(res.data.user.role);
            setTimeout(() => {
              setIsLogin(true);
              navigate("/dashboard");
            }, 1000);
          } else {
            toast.error(res.data.msg);
          }
        })
        .catch((err) => console.log("Error:", err));
    };
    sendLoginData();
  };

  const handleShowPassword = () => {
    setIsPassVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-sm lg:max-w-md">
        <div>
          <div className="text-black flex flex-col items-center gap-3 mb-5">
            <div className="bg-black rounded-2xl h-14 w-14 flex items-center justify-center">
              <LogIn className="text-white" />
            </div>
            <div>
              <p className="font-bold text-2xl"> Welcome Back</p>
              <p className="text-gray-700">Sign in to your account</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-[#989da4] text-sm font-semibold ">
              Email Address
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <Mail className="text-gray-400" size={20} />

              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent text-sm"
              />
            </div>
          </div>
          <div>
            <p className="text-[#989da4] text-sm font-semibold ">Password</p>

            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <Lock className="text-gray-400" size={20} />

              <input
                type={`${isPassVisible ? "text" : "password"}`}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              />
              <button
                onClick={handleShowPassword}
                type="button"
                className="text-[#989da4]"
              >
                {isPassVisible ? <Eye size={19} /> : <EyeOff size={19} />}
              </button>
            </div>
          </div>
          <button className="w-full bg-[#1c1917] active:scale-95 flex items-center justify-center gap-2 text-white py-2 rounded-lg font-semibold">
            <LogIn size={20} /> Sign In
          </button>
          <p className="text-[#1c1917] text-center">
            <span className="text-gray-600">Don't have an account?</span>{" "}
            <Link to="/signup" className="text-[rgb(28,25,23)] font-semibold">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
