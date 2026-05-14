import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import {
  CartProductContext,
  UserContext,
  ProductContext,
} from "../../contexts/context";
import { defaultPP, GradientButton, greenCartLogo } from "../index";

function Header() {
  const { isLogin, currentUser, setActiveTab, currentUserRole } =
    useContext(UserContext);
  const { productsList } = useContext(ProductContext);

  const { cartItems } = useContext(CartProductContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isProfileClicked, setIsProfileClicked] = useState(false);

  function onSearchProduct(searchInputBoxValue) {
    if (searchInputBoxValue?.length > 0) {
      setSearchValue(searchInputBoxValue);
      navigate(`/allproducts/searchproduct/${searchInputBoxValue}`);
    } else {
      setSearchValue("");
      navigate("/");
    }
  }

  if (!isLogin) {
    return (
      <div className="flex z-40 justify-between items-center mb-5 py-3 px-10">
        <div>
          <Link to="/">
            <span className="text-green-700 font-bold text-3xl">
              <img src={greenCartLogo} alt="logo" />
            </span>
          </Link>
        </div>
        {/* right nav  */}
        <div className="flex items-center gap-5">
          <div>
            <ul className=" gap-5 font-semibold sm:flex hidden">
              <li className="md:block hidden">
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "text-green-700" : "text-black"}`
                  }
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "text-green-700" : "text-black"}`
                  }
                  to="/allproduct"
                >
                  All Products
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-5 ">
            <div className="border-black border h-6 rounded-xl pl-2 items-center sm:flex hidden">
              <input
                className="outline-none h-6 bg-transparent px-1"
                type="text"
                value={searchValue}
                placeholder="Search Products..."
                onChange={(e) => onSearchProduct(e.target.value)}
              />
              <div className="border-l border-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="gray"
                >
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              </div>
            </div>

            {!isLogin && (
              <GradientButton componentType="Link" to="/login">
                Login
              </GradientButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center py-3 px-10">
      <div>
        <Link to="/dashboard">
          <span className="text-green-700 font-bold text-3xl">
            <img src={greenCartLogo} alt="logo image" />
          </span>
        </Link>
      </div>
      {/* right nav  */}
      <div className="flex items-startoutline-none gap-3">
        <div className="relative group">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="27px"
              viewBox="0 -960 960 960"
              width="27px"
              fill="#15803D"
              className="absolute top-1 right-0"
            >
              <path d="M180-204.62v-59.99h72.31v-298.47q0-80.69 49.81-142.69 49.8-62 127.88-79.31V-810q0-20.83 14.57-35.42Q459.14-860 479.95-860q20.82 0 35.43 14.58Q530-830.83 530-810v24.92q78.08 17.31 127.88 79.31 49.81 62 49.81 142.69v298.47H780v59.99H180Zm300-293.07Zm-.07 405.38q-29.85 0-51.04-21.24-21.2-21.24-21.2-51.07h144.62q0 29.93-21.26 51.12-21.26 21.19-51.12 21.19Zm-167.62-172.3h335.38v-298.47q0-69.46-49.11-118.57-49.12-49.12-118.58-49.12-69.46 0-118.58 49.12-49.11 49.11-49.11 118.57v298.47Z" />
            </svg>
          </button>
          <span className="absolute group-hover:animate-bounce top-1 right-0 h-1 w-1 rounded-full bg-red-600"></span>
        </div>
        {/* profile  */}
        <div className="relative">
          <button onClick={() => setActiveTab("personalinformation")}>
            <div className="overflow-hidden rounded-full h-7 w-7 border border-green-800">
              <img
                loading="lazy"
                className="rounded-[50%]"
                src={
                  currentUser.hasOwnProperty("imageUrl")
                    ? currentUser.imageUrl
                    : defaultPP
                }
                onClick={() => setIsProfileClicked((prev) => !prev)}
                alt="profile picture"
              />
            </div>
          </button>

          {/* Gp to the profile section */}
          <div
            className={`absolute right-0 bg-white rounded-xl w-max p-3 z-50 ${isProfileClicked ? "block" : "hidden"}`}
          >
            <ul className="text-sm">
              <li>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9">
                    <img
                      loading="lazy"
                      className="object-cover h-full w-full border border-red-500 rounded-[50%]"
                      src={
                        currentUser.hasOwnProperty("imageUrl")
                          ? currentUser.imageUrl
                          : defaultPP
                      }
                      alt="profile picture"
                    />
                  </div>
                  <div className="">
                    <p className="text-lg font-semibold">
                      {currentUser.username}
                    </p>
                    <p className="text-xs">{currentUser.email}</p>
                  </div>
                </div>
              </li>
              <li>
                <Link
                  to="dashboard"
                  onClick={() => setIsProfileClicked((prev) => !prev)}
                  className="flex items-center my-1 hover:bg-gray-100 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#666666"
                  >
                    <path d="M240-200h133.85v-237.69h212.3V-200H720v-360L480-740.77 240-560v360Zm-60 60v-450l300-225.77L780-590v450H526.15v-237.69h-92.3V-140H180Zm300-330.38Z" />
                  </svg>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="profile"
                  onClick={() => setIsProfileClicked((prev) => !prev)}
                  className="flex items-center my-1 hover:bg-gray-100 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="grey"
                  >
                    <path d="M367-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q560-607 560-640t-23.5-56.5Q513-720 480-720t-56.5 23.5Q400-673 400-640t23.5 56.5Q447-560 480-560t56.5-23.5ZM480-640Zm0 400Z" />
                  </svg>{" "}
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    setIsLogin(false);
                    setIsProfileClicked((prev) => !prev);
                    setCurrentUserRole("customer");
                    navigate("/");
                    location.reload();
                  }}
                  className="text-red-500 hover:bg-gray-100 rounded-md px-2 cursor-pointer flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ef4444"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                  </svg>
                  <span> Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
