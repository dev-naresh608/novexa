import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../../contexts/context";
import { loginUserApi } from "../services/authService";

export function useLoginForm() {
  const navigate = useNavigate();
  const { setCurrentUser, setCurrentUserRole, setIsLogin } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPassVisible, setIsPassVisible] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShowPassword = () => {
    setIsPassVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.email === "" || formData.password === "") {
      toast.warning("Please enter data");
      return;
    }

    try {
      const res = await loginUserApi(formData);

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
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return {
    formData,
    isPassVisible,
    handleChange,
    handleShowPassword,
    handleSubmit,
  };
}