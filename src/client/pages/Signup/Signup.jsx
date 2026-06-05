import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import {
  Car,
  ChevronDown,
  Store,
  User,
  UserPlus2Icon,
  Eye,
  EyeOff,
  Lock,
  Phone,
} from "lucide-react";
import { db } from "../../db/index";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/context";

export default function Signup() {
  const { setUserData } = useContext(UserContext);

  const [isSeller, setIsSeller] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [userId, setUserId] = useState(uuid());
  const [currentRole, setCurrentRole] = useState("customer");
  const [isPassVisible, setIsPassVisible] = useState(false);

  const navigate = useNavigate();
  const categories = [
    "Fruits & Vegetables",
    "Dairy & Bakery",
    "Snacks & Beverages",
    "Rice, Atta & Pulses",
    "Spices & Oils",
    "Packaged Foods",
    "Cleaning & Household",
    "Personal Care",
  ];

  useEffect(() => {
    if (isCustomer) {
      setCurrentRole("customer");
    } else if (isDriver) {
      setCurrentRole("driver");
    } else {
      setCurrentRole("seller");
    }
  }, [isCustomer, isDriver, isSeller]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    id: "",
    driver_status: true,
    driver_aadhaar_number: "",
    driver_vehicle_number: "",
    driver_dob: "",
    store_owner_name: "",
    store_name: "",
    store_address: "",
    store_type: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      store_owner_name: formData.username,
      role: currentRole,
      [e.target.name]: e.target.value,
      id: userId,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData) {
      const currentEmail = formData.email;
      const isMailExist = async () => {
        return await db.localUserData
          .where("email")
          .equals(currentEmail)
          .first();
      };

      if (await isMailExist()) {
        toast.info("This email is  already exist");
        return;
      }
      // toast.success("account created successfully");

      // delete the unwanted key of data. ex - driver is not required for resto_name.
      if (currentRole === "customer") {
        delete formData.driver_dob;
        delete formData.driver_status;
        delete formData.driver_aadhaar_number;
        delete formData.driver_vehicle_number;
        delete formData.store_name;
        delete formData.store_type;
        delete formData.store_address;
        delete formData.store_owner_name;
      } else if (currentRole === "seller") {
        delete formData.driver_dob;
        delete formData.driver_status;
        delete formData.driver_aadhaar_number;
        delete formData.driver_vehicle_number;
      } else if (currentRole === "driver") {
        delete formData.store_owner_name;
        delete formData.store_name;
        delete formData.store_type;
        delete formData.store_address;
      }

      toast.success("account created successfully");
      // ! indexDB :
      await db.localUserData.add(formData);
      setUserData(await db.localUserData.toArray());
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      toast.warning("enter data");
    }
  };

  const handleShowPassword = () => {
    setIsPassVisible((prev) => !prev);
  };

  return (
    <div className="p-10 flex justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div>
          <div className="text-black flex flex-col items-center gap-3 mb-5 text-center">
            <div className="bg-black rounded-2xl h-14 w-14 flex items-center justify-center">
              <UserPlus2Icon className="text-white" />
            </div>
            <div>
              <p className="font-bold text-2xl">Create account</p>
              <p className="text-gray-700">Join us today</p>
            </div>
          </div>
        </div>

        <form
  onSubmit={handleSubmit}
  className="space-y-4 text-black"
>
  {/* ROLE SELECTOR */}
  <div>
    <p className="text-[#989da4] text-sm">I am a...</p>

    <div className="flex gap-2 items-center font-semibold text-xs">
      <div
        className={`px-4 py-2 rounded-xl flex-1 ${
          isCustomer
            ? "bg-[#1c1917] text-white border"
            : "bg-gray-200 text-gray-500 border border-gray-400"
        }`}
      >
        <button
          name="role"
          className="flex w-full justify-center items-center gap-1"
          onClick={() => {
            setIsCustomer(true);
            setIsSeller(false);
            setIsDriver(false);
          }}
          type="button"
        >
          <User size={15} />
          <span>Customer</span>
        </button>
      </div>

      <div
        className={`px-4 py-2 rounded-xl flex-1 ${
          isDriver
            ? "bg-[#1c1917] text-white border"
            : "bg-gray-200 text-gray-500 border border-gray-400"
        }`}
      >
        <button
          name="role"
          className="flex w-full justify-center items-center gap-1"
          onClick={() => {
            setIsCustomer(false);
            setIsSeller(false);
            setIsDriver(true);
          }}
          type="button"
        >
          <Car size={15} />
          <span>Driver</span>
        </button>
      </div>

      <div
        className={`px-4 py-2 rounded-xl flex-1 ${
          isSeller
            ? "bg-[#1c1917] text-white border"
            : "bg-gray-200 text-gray-500 border border-gray-400"
        }`}
      >
        <button
          name="role"
          className="flex w-full justify-center items-center gap-1"
          onClick={() => {
            setIsCustomer(false);
            setIsSeller(true);
            setIsDriver(false);
          }}
          type="button"
        >
          <Store size={15} />
          <span>Seller</span>
        </button>
      </div>
    </div>
  </div>

  {/* USERNAME */}
  <div>
    <p className="text-[#989da4] text-sm font-semibold">Username</p>

    <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
      <User className="text-gray-400" size={20} />

      <input
        required
        type="text"
        name="username"
        placeholder="Username..."
        onChange={handleChange}
        className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
      />
    </div>
  </div>

  {/* EMAIL */}
  <div>
    <p className="text-[#989da4] text-sm font-semibold">Email</p>

    <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
      <User className="text-gray-400" size={20} />

      <input
        required
        type="email"
        name="email"
        placeholder="Email..."
        onChange={handleChange}
        className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
      />
    </div>
  </div>

  {/* PASSWORD */}
  <div>
    <p className="text-[#989da4] text-sm font-semibold">Password</p>

    <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
      <Lock className="text-gray-400" size={20} />

      <input
        type={isPassVisible ? "text" : "password"}
        name="password"
        required
        placeholder="Password..."
        onChange={handleChange}
        className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
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

  {/* PHONE */}
  <div>
    <p className="text-[#989da4] text-sm font-semibold">Phone</p>

    <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
      <Phone className="text-gray-400" size={20} />

      <input
        required
        type="tel"
        name="phone"
        placeholder="Enter phone number..."
        onChange={handleChange}
        className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
      />
    </div>
  </div>

  {/* SELLER FIELDS */}
  {isSeller && (
    <div className="space-y-4">
      {/* STORE NAME */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">
          Store Name
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <Store className="text-gray-400" size={20} />

          <input
            required
            type="text"
            name="store_name"
            placeholder="Enter store name..."
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* STORE CATEGORY */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">
          Store Category
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <ChevronDown className="text-gray-400" size={20} />

          <select
            name="store_type"
            onChange={handleChange}
            required
            className="w-full bg-transparent outline-none text-gray-600 text-sm"
          >
            <option value="">Select Category</option>

            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STORE ADDRESS */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">
          Store Address
        </p>

        <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-3">
          <textarea
            required
            name="store_address"
            placeholder="Enter store address..."
            onChange={handleChange}
            rows={3}
            className="w-full resize-none bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>
    </div>
  )}

  {/* DRIVER FIELDS */}
  {isDriver && (
    <div className="space-y-4">
      {/* DOB */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">
          Date of Birth
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <User className="text-gray-400" size={20} />

          <input
            required
            type="date"
            name="driver_dob"
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-600 text-sm"
          />
        </div>
      </div>

      {/* VEHICLE NUMBER */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">
          Vehicle Number
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <Car className="text-gray-400" size={20} />

          <input
            required
            type="text"
            name="driver_vehicle_number"
            placeholder="Ex: GJ-01-AB-1234"
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* AADHAAR */}
      <div>
        <p className="text-[#989da4] text-sm font-semibold">
          Aadhaar Number
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
          <User className="text-gray-400" size={20} />

          <input
            required
            type="number"
            name="driver_aadhaar_number"
            placeholder="Enter aadhaar number..."
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 text-sm"
          />
        </div>
      </div>
    </div>
  )}

  {/* SUBMIT BUTTON */}
  <button className="w-full bg-[#1c1917] active:scale-95 flex items-center justify-center gap-2 text-white py-3 rounded-xl font-semibold">
    <UserPlus2Icon size={20} />
    Create Account
  </button>

  {/* LOGIN */}
  <p className="text-center text-sm">
    <span className="text-gray-600">
      Already have an account?
    </span>{" "}
    <Link
      to="/login"
      className="text-[#1c1917] font-semibold"
    >
      Sign in
    </Link>
  </p>
</form>
      </div>
    </div>
  );
}
