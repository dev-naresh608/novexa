import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../../contexts/context";
import { loginUserApi } from "../services/auth.service.api";
import { useModal } from "../../../components";

export function useLoginForm() {
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const { setCurrentUser, setCurrentUserRole, setIsLogin } =
    useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const res = await loginUserApi(formData);

      if (res.data.success) {
        toast.success("Login successful");
        setCurrentUser(res.data.user);

        setCurrentUserRole(res.data.user.role);
        setTimeout(() => {
          setIsLogin(true);
          closeModal();
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    isPassVisible,
    loading,
    handleChange,
    handleShowPassword,
    handleSubmit,
  };
}
