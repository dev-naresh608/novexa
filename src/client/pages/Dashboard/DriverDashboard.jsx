import React, { useContext } from "react";
import { defaultPP } from "../../components/index";
import { UserContext } from "../../contexts/context";
import { NavLink } from "react-router-dom";

function DriverDashboard() {
  const { currentUser, setActiveTab } = useContext(UserContext);

  console.log(currentUser);

  return (
    <>
      <div className="flex-1 bg-gray-100 p-5">
        {/* ===== TOP DRIVER INFO ===== */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img
                src={
                  currentUser.hasOwnProperty("imageUrl")
                    ? currentUser.imageUrl
                    : defaultPP
                }
                alt=""
                className="w-20 h-20 rounded-full object-cover"
              />

              <div>
                <h1 className="text-2xl font-bold">{currentUser.username}</h1>

                <p className="text-gray-500 mt-1">Delivery Driver</p>

                <div className="flex gap-3 mt-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    4.8 Rating
                  </span>
                </div>
              </div>
            </div>

            <NavLink onClick={() => setActiveTab("setting")} to="/profile/setting" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg">
              Edit Profile
            </NavLink>
          </div>
        </div>

        {/* ===== DRIVER STATS ===== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Total Deliveries</h3>

            <h1 className="text-3xl font-bold">245</h1>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Today's Deliveries</h3>

            <h1 className="text-3xl font-bold">18</h1>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Earnings</h3>

            <h1 className="text-3xl font-bold">₹3,250</h1>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="text-gray-500 text-sm mb-2">Pending Orders</h3>

            <h1 className="text-3xl font-bold">5</h1>
          </div>
        </div>

        {/* ===== MAIN SECTION ===== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ===== DRIVER DETAILS ===== */}

          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-xl font-semibold mb-5">Driver Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Date of Birth</p>

                <h4 className="font-medium">12 March 2000</h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Aadhaar Number</p>

                <h4 className="font-medium">
                  XXXX XXXX{" "}
                  <span>{currentUser.driver_aadhaar_number?.slice(8) || "3610"}</span>
                </h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Vehicle Number</p>

                <h4 className="font-medium">{currentUser.driver_vehicle_number}</h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Phone Number</p>

                <h4 className="font-medium">+91 {currentUser.phone}</h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Email</p>

                <h4 className="font-medium">{currentUser.email}</h4>
              </div>
            </div>
          </div>

          {/* ===== CURRENT DELIVERIES ===== */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Current Deliveries</h2>

              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
                View All
              </button>
            </div>

            {/* ===== ORDER ===== */}

            <div className="border rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Order #1254</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Pizza Burger Combo
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  On The Way
                </span>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm">Delivery Address</p>

                <h4 className="font-medium">Nikol, Ahmedabad</h4>
              </div>
            </div>

            {/* ===== ORDER ===== */}

            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Order #1260</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Pasta & Cold Coffee
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  Picked Up
                </span>
              </div>

              <div className="mt-4">
                <p className="text-gray-500 text-sm">Delivery Address</p>

                <h4 className="font-medium">Chandkheda, Ahmedabad</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DriverDashboard;
