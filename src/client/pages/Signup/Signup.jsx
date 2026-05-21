import React, { useState, useContext, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { ChevronDown } from "lucide-react";
import { db } from "../../db/index";

import { UserContext } from "../../contexts/context";
import { fromJSON } from "postcss";

export default function Signup() {
  const { setUserData } = useContext(UserContext);

  const [isSeller, setIsSeller] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true);
  const [isDriver, setIsDriver] = useState(false);
  const [userId, setUserId] = useState(uuid());
  const [currentRole, setCurrentRole] = useState("customer");

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
    driver_aadhaar_number: "",
    driver_vehicle_number: "",
    driver_dob: "",
    restaurant_owner_name: "",
    restaurant_name: "",
    restaurant_address: "",
    restaurant_type: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      restaurant_owner_name: formData.username,
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
        delete formData.driver_aadhaar_number;
        delete formData.driver_vehicle_number;
        delete formData.restaurant_name;
        delete formData.restaurant_type;
        delete formData.restaurant_address;
        delete formData.restaurant_owner_name;
      } else if (currentRole === "seller") {
        delete formData.driver_dob;
        delete formData.driver_aadhaar_number;
        delete formData.driver_vehicle_number;
      } else if (currentRole === "driver") {
        delete formData.restaurant_owner_name;
        delete formData.restaurant_name;
        delete formData.restaurant_type;
        delete formData.restaurant_address;
      }

      toast.success('account created successfully');
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

  return (
    <div className="p-10 flex justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center pb-5">Sign Up</h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 text-black 
          [&_input]:bg-transparent 
          [&_input]:outline-none 
          [&_input]:border 
          [&_input]:rounded-lg 
        [&_input:not([type='date']):not([name='driver_vehicle_number'])]:w-full
          [&_input]:px-4 [&_input]:py-2 "
        >
          <input
            required
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <input
            required
            type="phone"
            name="phone"
            placeholder="Enter phone number..."
            onChange={handleChange}
          />

          <div>
            <div className="flex gap-2 items-center justify-center w-max px-2.5 py-1.5 rounded-3xl bg-gray-300 text-black font-semibold text-sm">
              <div
                className={`px-2 py-1 rounded-2xl ${isCustomer ? "bg-gray-200" : ""}`}
              >
                <button
                  name="role"
                  value={isCustomer}
                  onClick={() => {
                    setIsCustomer(true);
                    setIsSeller(false);
                    setIsDriver(false);
                  }}
                  type="button"
                >
                  Customer
                </button>
              </div>
              <div
                className={`px-2 py-1 rounded-2xl ${isDriver ? "bg-gray-200" : ""}`}
              >
                <button
                  name="role"
                  value={isDriver}
                  onClick={() => {
                    setIsCustomer(false);
                    setIsSeller(false);
                    setIsDriver(true);
                  }}
                  type="button"
                >
                  Driver
                </button>
              </div>
              <div
                className={`px-2 py-1 rounded-2xl ${isSeller ? "bg-gray-200" : ""}`}
              >
                <button
                  name="role"
                  value={isSeller}
                  onClick={() => {
                    setIsCustomer(false);
                    setIsSeller(true);
                    setIsDriver(false);
                  }}
                  type="button"
                >
                  Seller
                </button>
              </div>
            </div>
          </div>

          {isSeller && (
            <>
              <div className="text-sm font-semibold space-y-2">
                <input
                  required
                  type="text"
                  name="restaurant_name"
                  placeholder="Enter restaurant name..."
                  onChange={handleChange}
                />
                <select
                  name="restaurant_type"
                  onChange={handleChange}
                  required
                  className="border p-2 rounded bg-transparent"
                >
                  <option value="">Select Category</option>

                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <textarea
                  required
                  name="restaurant_address"
                  placeholder="Enter restaurant Address..."
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-transparent outline-none border px-4 rounded-md"
                />
              </div>
            </>
          )}

          {isDriver && (
            <>
              <div className="text-sm font-semibold grid sm:grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <label htmlFor="driverDob">Date of Birth</label>
                  <input
                    id="driverDob"
                    required
                    type="date"
                    name="driver_dob"
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="vehicleNumber">Vehicle Num.</label>

                  <input
                    id="vehicleNumber"
                    required
                    type="text"
                    name="driver_vehicle_number"
                    placeholder="Ex: DL-3C-1234"
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col sm:col-span-2">
                  <label htmlFor="adharNumber">Aadhaar Card Num.</label>
                  <input
                    id="adharNumber"
                    required
                    type="number"
                    name="driver_aadhaar_number"
                    placeholder="Enter aadhaar num..."
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg"
          >
            Create Account
          </button>
          <p className="text-black">
            Already Have an account ?
            <Link to="/login" className="text-blue-800">
              {" "}
              Login
            </Link>
          </p>
        </form>
        <ToastContainer autoClose={600} pauseOnHover={false}></ToastContainer>
      </div>
    </div>
  );
}
