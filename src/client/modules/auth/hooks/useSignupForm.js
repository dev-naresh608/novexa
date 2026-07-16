import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { signupUserApi } from "../services/auth.service.api";

const INITIAL_FORM_DATA = {
  username: "",
  email: "",
  password: "",
  phone: "",
  driver_status: true,
  driver_aadhaar_number: "",
  driver_vehicle_number: "",
  driver_dob: "",
  store_owner_name: "",
  store_name: "",
  store_address: "",
  store_type: "",
};

export function useSignupForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query param (?role=seller or ?role=driver) read
  const roleParam = searchParams.get("role");
  const validRoles = ["customer", "seller", "driver"];
  const currentRole = validRoles.includes(roleParam) ? roleParam : "customer";

  const setCurrentRole = (role) => {
    setSearchParams({ role }, { replace: true });
  };

  const [isPassVisible, setIsPassVisible] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleShowPassword = () => {
    setIsPassVisible((prev) => !prev);
  };


  const buildPayload = () => {
    const base = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: currentRole,
    };

    if (currentRole === "seller") {
      return {
        ...base,
        store_owner_name: formData.username,
        store_name: formData.store_name,
        store_type: formData.store_type,
        store_address: formData.store_address,
      };
    }

    if (currentRole === "driver") {
      return {
        ...base,
        driver_status: formData.driver_status,
        driver_dob: formData.driver_dob,
        driver_vehicle_number: formData.driver_vehicle_number,
        driver_aadhaar_number: formData.driver_aadhaar_number,
      };
    }

    // customer — base fields only
    return base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload();

    try {
      const {data} = await signupUserApi(payload);

      if (data.success) {
        toast.success(`Signup successful`);
        // setTimeout(() => {
        //   navigate("/login");
        // }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return {
    formData,
    currentRole,
    setCurrentRole,
    isPassVisible,
    handleChange,
    handleShowPassword,
    handleSubmit,
  };
}