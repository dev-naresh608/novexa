import React, { useContext } from "react";
import { AddressContext, UserContext } from "../../contexts/context";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { db } from "../../db";

function AddressForm() {
  const navigate = useNavigate();
  const { address, setAddress } = useContext(AddressContext);
  const { currentUser, setCurrentUser, setUserData } = useContext(UserContext);

  let changedAddress = "";

  function handleChange(e) {
    const { name, value } = e.target;
    changedAddress = { ...address, [name]: value };

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateCurrentUser = {
      ...currentUser,
      myAddress: address,
    };
    setCurrentUser(updateCurrentUser);

    //update currentUser:
    const isUpdate = await db.localUserData.update(currentUser.id, {
      myAddress: address,
    });
    if(isUpdate){
      toast.success("Address Changed");
    }else{
      toast.error("Something Wrong to change Address");
    }
    setUserData(await db.localUserData.toArray());
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="max-w-md sm:mt-20 mt-10 mb-10 mx-auto p-6 bg-white shadow-lg rounded-2xl border">
      <h2 className="text-xl font-semibold text-gray-800">Add Address</h2>

      <form onSubmit={handleSubmit} className="space-y-3 text-white">
        <input
          required
          type="text"
          name="name"
          placeholder="Full Name"
          value={address.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          required
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={address.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          required
          type="text"
          name="street"
          placeholder="Street Address"
          value={address.street}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          required
          type="text"
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          required
          type="text"
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <input
          required
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={address.pincode}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Save Address
        </button>
      </form>
      <ToastContainer autoClose={500} pauseOnHover={false}></ToastContainer>
    </div>
  );
}

export default AddressForm;
