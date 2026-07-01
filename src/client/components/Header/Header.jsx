import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  CartProductContext,
  UserContext,
  ProductContext,
} from "../../contexts/context";
import { greenCart_logo } from "../../assets/assets";
import {
  GradientButton,
  ProfileToggle,
  NotificationToggle,
} from "..";
import { Store } from "lucide-react";

function Header() {
  const { isLogin } = useContext(UserContext);
  const { productsList } = useContext(ProductContext);
  const { cartItems } = useContext(CartProductContext);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  function onSearchProduct(searchInputBoxValue) {
    if (searchInputBoxValue?.length > 0) {
      setSearchValue(searchInputBoxValue);
      navigate(`/allproducts/searchproduct/${searchInputBoxValue}`);
    } else {
      setSearchValue("");
      navigate("/");
    }
  }

  // useEffect(() => {

  //   const api1 = `http://localhost:5000/api/distance?lat1=${23.022}lon1=&${72.572}lat2=&${19.076}lon2=&${72.877}`;

  //   const api2 = `http://localhost:5000/api/address?=Ahmedabad`;
  //   fetch(api2).then(async (res) => {
  //     console.log(await res.json());
  //   });

  // }, []);



  if (!isLogin) {
    return (
      <div className="flex z-40 justify-between items-center py-2.5 px-10">
        <div>
          <Link to="/">
            <span className="text-green-700 font-bold">
              <img className="h-10" src={greenCart_logo} alt="logo" />
            </span>
          </Link>
        </div>

        {/* right nav */}
        <div className="flex items-center gap-5">
          <div>
            <ul className="gap-5 font-semibold text-sm sm:flex hidden">
              <li className="md:block hidden ">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-green-700" : "text-black"
                  }
                  to="/"
                >
                  HOME
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    `${isActive ? "text-green-700" : "text-black"}`
                  }
                  to="/allproduct"
                >
                  ALL PRODUCTS
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-5">
            <div className="border-gray-700 border h-6 overflow-hidden rounded-xl pl-2 items-center sm:flex hidden">
              <input
                className="outline-none h-6 bg-transparent px-1 font-semibold text-xs"
                type="text"
                value={searchValue}
                placeholder="Search Products..."
                onChange={(e) => onSearchProduct(e.target.value)}
              />
              <div className="border-l border-black p-1">
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
    <div className="flex bg-white/60 border justify-between items-center py-3 px-10">
      <div>
        <Link to="/dashboard">
          <span className="text-green-700 font-bold text-3xl">
            <img className="h-8" src={greenCart_logo} alt="logo image" />
          </span>
        </Link>
      </div>

      {/* right nav */}
      <div className="flex gap-3">
        {/* Notification */}
        <NotificationToggle />
        {/* profile */}
        <ProfileToggle />
      </div>
    </div>
  );
}

export default Header;
