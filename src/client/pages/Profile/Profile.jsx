import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/context";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  defaultPP,
  PersonalInfo,
  Orders,
  Setting,
  Payments,
  Cart,
  MyProducts,
  Wishlist,
} from "../../components/index";

function Profile() {
  const navigate = useNavigate();
  const {
    currentUser,
    activeTab,
    setActiveTab,
    isLogin,
    setIsLogin,
    setCurrentUserRole,
  } = useContext(UserContext);

  if (!isLogin) {
    return (
      <>
        <div className="min-h-[50vh] m-auto w-full sm:max-w-[80vw] mt-10 mb-10 bg-white shadow-md p-5  space-y-3 rounded-2xl">
          <h2 className="capatalize capitalize">Opps! You Have not login</h2>
          <p>
            Click here to{" "}
            <Link to="/login" className="font-semibold text-red-600">
              Login
            </Link>
          </p>
        </div>
      </>
    );
  }

  if (activeTab == null) {
    setActiveTab("personalinformation");
  }

  const sections = [
    {
      name: "Personal Info",
      icon: "👤",
      tabToActive: () => setActiveTab("personalinformation"),
      to: "personalinformation",
    },
    {
      name: "Payments",
      icon: "💳",
      tabToActive: () => setActiveTab("payments"),
      to: "payments",
    },
    {
      name: "Settings",
      icon: "⚙️",
      tabToActive: () => setActiveTab("setting"),
      to: "setting",
    },
  ];

  return (
    <>
      <div className="min-h-[90vh] m-auto w-full bg-white shadow-md rounded-2xl sm:max-w-[96vw] max-w-[90vw] font-semibold grid sm:grid-cols-[40vh,1fr]">
        {/* <div className="space-y-3 shadow-md rounded-2xl "> */}
        <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-2 space-y-6">
          <div className="text-center ">
            <div className="flex justify-center">
              <img
                className="h-32 w-32 rounded-[50%] border border-green-600"
                src={
                  currentUser.hasOwnProperty("imageUrl")
                    ? currentUser.imageUrl
                    : defaultPP
                }
                alt="profile picture"
              />
            </div>
            <div className="border-b border-black py-2">
              <h2 className="pb-2">
                {currentUser?.username || "Unauthorized User"}
              </h2>
            </div>
          </div>
          <div className="px-2">
            <ul className="">
              {sections.map((s, i) => (
                <li
                  onClick={s.tabToActive}
                  className="cursor-pointer hover:text-green-600"
                >
                  <NavLink
                    to={s.to}
                    className={({ isActive }) =>
                      isActive ? "text-green-600" : ""
                    }
                  >
                    {s.icon} {s.name}
                  </NavLink>
                </li>
              ))}

              <li
                onClick={() => {
                  setIsLogin(false);
                  navigate("/login");
                  setCurrentUserRole("customer");
                  location.reload();
                }}
                className="text-red-500 cursor-pointer"
              >
                🚪 Logout
              </li>
            </ul>
          </div>
        </div>

        <div>
          {activeTab === "personalinformation" && <PersonalInfo />}
          {activeTab === "payments" && <Payments />}
          {activeTab === "setting" && <Setting />}
        </div>
      </div>
    </>
  );
}

export default Profile;
