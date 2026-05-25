import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/context";
import { db } from "../../db";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const {
    setCurrentUser,
    setCurrentUserRole,
    setIsLogin,
    setActiveTab,
  } = useContext(UserContext);

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

    const user = await db.localUserData
      .where("email")
      .equals(formData.email)
      .first();

    if (!user) {
      toast.error("Invalid credentials");
      return;
    }

    // ! CHECK VALID USER
    const isValidUser =
      user.email === formData.email && user.password === formData.password
        ? true
        : false;

    if (isValidUser) {
      
      setCurrentUser(user);

      setCurrentUserRole(user.role);
      toast.success("Login successful");
      setTimeout(() => {
        setIsLogin(true);
        navigate("/dashboard");
      }, 1000);
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
    
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button className="w-full bg-blue-500 text-white py-2 rounded-lg">
            Login
          </button>
          <p className="text-black">
            Don't Have Account:
            <Link to="/signup" className="text-blue-700">
              {" "}
              Signup
            </Link>
          </p>
          
        </form>
      </div>
    </div>
  );
}
