import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/context";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  PersonalInfo,
  Setting,
  Payments,
} from "../pages";


import {defaultPP} from "../../assets/assets"
import { CardSim, CreditCard, LogOut, Settings, User } from "lucide-react";

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
      icon: <User size={20}/>,
      tabToActive: () => setActiveTab("personalinformation"),
      to: "personalinformation",
    },
    {
      name: "Payments",
      icon: <CreditCard size={20} />,
      tabToActive: () => setActiveTab("payments"),
      to: "payments",
    },
    {
      name: "Settings",
      icon: <Settings size={20}/>,
      tabToActive: () => setActiveTab("setting"),
      to: "setting",
    },
  ];

  return (
    <>
      <div className="shadow-md rounded-2xl grid grid-cols-[40vh,1fr] min-h-[90vh] bg-white">
        {/* <div className="space-y-3 shadow-md rounded-2xl "> */}
        <div className="w-full font-semibold max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-2 space-y-6">
          <div className="text-center">
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
            <div className="border-b border-black py-2 space-y-3">
              <h2>
                {currentUser?.username || "Unauthorized User"}
              </h2>
              <div className="space-x-2 text-xs pb-2">
                <span className="px-2 text-green-800 py-1 bg-green-200 rounded-2xl">
                  Active
                </span>
                <span className="px-2 text-gray-800/800 py-1 bg-yellow-100 rounded-2xl">
                  {currentUser?.role || ""}
                </span>
              </div>
            </div>
          </div>
          <div className="px-2">
            <ul>
              {sections.map((s, i) => (
                <li
                key={i}
                  onClick={s.tabToActive}
                  className="cursor-pointer transition-colors duration-150 hover:text-green-600"
                >
                  <NavLink
                    to={s.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 ${isActive ? "text-green-600" : ""}`
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
                className="text-red-500 cursor-pointer flex items-center gap-2"
              >
                <LogOut size={20}/> Logout
              </li>
            </ul>
          </div>
        </div>

        <div className="px-5">
          {activeTab === "personalinformation" && <PersonalInfo />}
          {activeTab === "payments" && <Payments />}
          {activeTab === "setting" && <Setting />}
        </div>
      </div>
    </>
  );
}

export default Profile;
