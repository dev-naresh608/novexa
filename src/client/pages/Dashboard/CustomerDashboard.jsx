import React, { useContext } from "react";
import { UserContext } from "../../contexts/context";
import { defaultPP } from "../../components/index";
import { NavLink } from "react-router-dom";

function CustomerDashboard() {
  const { currentUser } = useContext(UserContext);
  let currentUserAddress = "";
  const isAddressAvailable = currentUser.hasOwnProperty("myAddress");

  if (isAddressAvailable) {
    currentUserAddress = `${currentUser.myAddress.name} ${currentUser.myAddress.phone} ${currentUser.myAddress.street} ${currentUser.myAddress.city} ${currentUser.myAddress.state}, ${currentUser.myAddress.pincode} `;
  }
  

  return (
    <>
      <div className="flex-1 bg-gray-100 p-5">
        {/* ===== TOP SECTION ===== */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome Back, {currentUser.username.split(' ')[0]}</h1>

              <p className="text-gray-500 mt-2">
                Explore your orders and favorite foods.
              </p>
            </div>

            <img
              src={
                currentUser.hasOwnProperty("imageUrl")
                  ? currentUser.imageUrl
                  : defaultPP
              }
              alt="profile picture"
              className="w-16 h-16 rounded-full"
            />
          </div>
        </div>

        {/* ===== STATS CARDS ===== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-gray-500 text-sm mb-2">Total Orders</h3>

            <h1 className="text-3xl font-bold">
              {currentUser?.myOrders.length || "0"}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-gray-500 text-sm mb-2">Active Orders</h3>

            <h1 className="text-3xl font-bold">2</h1>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-gray-500 text-sm mb-2">Wishlist Items</h3>
            <h1 className="text-3xl font-bold">
              {currentUser?.myWishlist.length || "0"}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="text-gray-500 text-sm mb-2">Recently Viewed</h3>

            <h1 className="text-3xl font-bold">2</h1>
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ===== RECENT ORDERS ===== */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">Recent Orders</h2>

              <NavLink to={"/orders"} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                View All
              </NavLink>
            </div>

            {/* ORDER */}

            <div className="border rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Cheese Burger Combo</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Ordered from Burger Hub
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  Preparing
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-medium">₹249</p>

                <button className="text-green-600 font-medium">
                  Track Order
                </button>
              </div>
            </div>

            {/* ORDER */}

            <div className="border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Pasta & Cold Coffee</h3>

                  <p className="text-gray-500 text-sm mt-1">
                    Ordered from Food Plaza
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  Delivered
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="font-medium">₹320</p>

                {/* <button className="text-green-600 font-medium">Reorder</button> */}
              </div>
            </div>
          </div>

          {/* ===== PROFILE / ADDRESS ===== */}

          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-2xl font-semibold mb-5">Profile</h2>

            <div className="flex flex-col items-center">
              <img
                src={
                  currentUser.hasOwnProperty("imageUrl")
                    ? currentUser.imageUrl
                    : defaultPP
                }
                alt="profile picture"
                className="w-24 h-24 rounded-full mb-4"
              />

              <h3 className="text-xl font-semibold">{currentUser.username}</h3>

              <p className="text-gray-500 mt-1">{currentUser.email}</p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Phone Number</p>

                <h4 className="font-medium">+91 {currentUser.phone}</h4>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Default Address</p>

                {!isAddressAvailable ? (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-center text-sm">
                    <NavLink
                    to={"/addressform"}
                      className="font-medium hover:underline"
                      // onClick={() => navigate("/addressform")}
                    >
                      + Add Address
                    </NavLink>
                  </div>
                ) : (
                  <div className="mb-5">
                    <div className="mt-2 bg-gray-200/40 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                      {currentUserAddress}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CustomerDashboard;
