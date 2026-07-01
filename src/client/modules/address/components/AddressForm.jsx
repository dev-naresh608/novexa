import { div } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleAddAddressApi } from "../../index";
function AddressForm({ closeBtnAction, userId, setAddress }) {
  const initialFormData = {
    name: "",
    phone: "",
    city: "",
    street: "",
    state: "",
    pincode: "",
  };

  // ==== STATE =======
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  useEffect(() => {
    // console.log(formData);
  }, [formData]);

  const handleSubmit = () => {
    //  ===== validation =====
    if (formData.pincode <= 0) {
      return toast.error("Invalid pincode number");
    }
    if (formData.pincode.length !== 6) {
      return toast.error("Pincode length must be 6");
    }

    if (!userId) {
      return toast.error("No user id found");
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      pincode: Number(formData.pincode),
    };

    const addAddress = async () => {
      const data = await handleAddAddressApi(userId, payload);
      if (!data.success) {
        return toast.error(data.message);
      }
      setAddress(data.address);
    };
    addAddress();

    setTimeout(() => {
      closeBtnAction((prev) => !prev);
      setFormData(initialFormData);
      toast.success("Address added successfully");
    }, 0);
  };
  return (
    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-gray-500/20 z-50">
      <div className="relative bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-sm lg:max-w-md space-y-5">
        <p className="font-bold text-center text-xl">Add Address</p>
        <div className="absolute top-0 right-2">
          <button onClick={() => closeBtnAction((prev) => !prev)}>✘</button>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <input
                type="text"
                name="name"
                placeholder="name"
                onChange={handleChange}
                value={formData?.name}
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              />
            </div>
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <input
                type="text"
                name="phone"
                value={formData?.phone}
                placeholder="phone"
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              />
            </div>
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <input
                type="text"
                name="street"
                placeholder="street"
                onChange={handleChange}
                value={formData?.street}
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              />
            </div>
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <input
                type="text"
                name="city"
                placeholder="city"
                onChange={handleChange}
                value={formData?.city}
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              />
            </div>
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <input
                type="text"
                name="state"
                placeholder="state"
                onChange={handleChange}
                value={formData?.state}
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              />
            </div>
            <div className="rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
              <input
                type="number"
                name="pincode"
                placeholder="pincode"
                onChange={handleChange}
                value={formData?.pincode}
                className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent"
              />
            </div>

            <div className="flex justify-center items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-semibold text-green-600 rounded-lg bg-green-200 active:scale-95 transition-colors"
              >
                Add
              </button>
              <button
                type="reset"
                className="px-4 py-2 text-sm font-semibold text-red-600 rounded-lg bg-red-200 active:scale-95 transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddressForm;
