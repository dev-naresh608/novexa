import React, { useContext, useEffect, useState } from "react";
import { Hero, Footer } from "../../components/component";

import { Category, Orders, Setting, Wishlist, Cart } from "../pages";

import {
  delivery_truck,
  trust_icon,
  coin_icon,
  leaf_icon,
  bottom_banner,
  bottom_banner_h,
  bottom_banner_v,
} from "../../assets/assets";

import {
  UserContext,
  CartProductContext,
} from "../../contexts/context";
import { Menu, X } from "lucide-react";
import { NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
function Home({ productsList }) {
  const { isLogin, leftPanelItems, secondLeftPanelItems, currentUser } =
    useContext(UserContext);
  const navigate = useNavigate();

  const { setActiveTab, activeTab } = useContext(UserContext);
  const { cartItems } = useContext(CartProductContext);


  if (!isLogin) {
    const items = [
      {
        text: "Fastest Delivery",
        text_info: "Groceries delivered in under 30 minutes.",
        src: delivery_truck,
      },
      {
        text: "Freshness Guaranteed",
        text_info: "Fresh produce straight from the source.",
        src: leaf_icon,
      },
      {
        text: "Affordable Prices",
        text_info: "Quality groceries at unbeatable prices.",
        src: coin_icon,
      },
      {
        text: "Trusted by Thousands",
        text_info: "Loved by 10,000+ happy customers.",
        src: trust_icon,
      },
    ];
    return (
      <>
        <Hero />
        <Category />
        <section className="p-5 py-10">
          <div className="sm:flex sm:gap-10 space-y-10 bg-blue-200 rounded-2xl p-5 sm:items-center">
            {/* left  */}
            <div className="w-auto sm:w-[60vw] md:w-[80vw]">
              <img src={bottom_banner} alt="bottom banner image" />
            </div>
            {/* right  */}
            <div className="w-full">
              <div>
                <div className="text-green-700 text-4xl font-semibold mb-5">
                  <p>Why We Are the Best?</p>
                </div>
                {items.map((item, i) => {
                  return (
                    <div key={i} className="flex items-center gap-3  my-2">
                      <div className="w-10 h-10">
                        <img className="h-max w-max" src={item.src} alt="" />
                      </div>
                      <div>
                        <p className="font-semibold text-2xl sm:text-xl md:text-xl text-[#364153]">
                          {item.text}
                        </p>
                        <p className="text-[#9c9aa4] md:text-md sm:text-sm">
                          {item.text_info}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  return (
    <>
      <div>
        <div className="flex h-[90vh]">
          {/* left panel */}
          <div className="relative bg-white h-full pt-3">
            <div>
              {/* <div className="p-3 space-y-1 border-b border-green-300"> */}
              <div className="p-3 space-y-1">
                {/* for customer  */}
                {currentUser.role === "customer" &&
                  leftPanelItems
                    .filter((item) => item.showToCustomer)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        // onClick={item.handleOnClick}
                        className={({ isActive }) => {
                          return `relative hover:scale-105 duration-150 flex gap-2 text-sm items-center font-semibold w-full px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800"}`;
                        }}
                      >
                        {item.svg}
                        {!isLeftPanelOpen && item.to === "/cart" && (
                          <div className="absolute top-0 right-0.5 text-xs">
                            <div className="">{cartItems?.length || "0"}</div>
                          </div>
                        )}
                        {isLeftPanelOpen && (
                          <span className="flex items-center">
                            {item.children}
                            {item.to === "/cart" && (
                              <div>
                                <div>
                                  <span>{"⠀- ⠀"}</span>
                                  {cartItems?.length || "0"}
                                </div>
                              </div>
                            )}
                          </span>
                        )}
                      </NavLink>
                    ))}

                {/* for seller  */}
                {currentUser.role === "seller" &&
                  leftPanelItems
                    .filter((item) => item.showToSeller)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        // onClick={item.handleOnClick}
                        className={({ isActive }) => {
                          return `flex gap-2 text-sm items-center font-semibold w-full  px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800/80"}`;
                        }}
                      >
                        {item.svg}
                        {isLeftPanelOpen && <span>{item.children}</span>}
                      </NavLink>
                    ))}

                {/* for driver  */}
                {currentUser.role === "driver" &&
                  leftPanelItems
                    .filter((item) => item.showToDriver)
                    .map((item, i) => (
                      <NavLink
                        key={i}
                        to={item.to}
                        // onClick={item.handleOnClick}
                        className={({ isActive }) => {
                          return `flex gap-2 text-sm items-center font-semibold w-full  px-2 py-1.5 rounded-md hover:bg-green-800 hover:text-white hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-green-800/80"}`;
                        }}
                      >
                        {item.svg}
                        {isLeftPanelOpen && <span>{item.children}</span>}
                      </NavLink>
                    ))}
              </div>

              {/* For both */}
              {/* <div className="p-3 space-y-1">
                {secondLeftPanelItems.map((item, i) => (
                  <NavLink
                    key={i}
                    to={item.to}
                    // onClick={item.handleOnClick}
                    className={({ isActive }) => {
                      return `flex gap-2 text-sm items-center font-semibold w-full px-2 py-1.5 rounded-md hover:bg-green-800 
                      hover:text-white  hover:shadow-md group whitespace-nowrap ${isActive ? "bg-green-800 text-white shadow-md" : "bg-none text-gray-500"}`;
                    }}
                  >
                    {<item.svg className="fill-gray-500 text-white" />}
                    {isLeftPanelOpen && <span>{item.children}</span>}
                  </NavLink>
                ))}
              </div> */}
              <div className="absolute z-50 right-0 top-0">
                <button onClick={() => setIsLeftPanelOpen((prev) => !prev)}>
                  {isLeftPanelOpen ? "✘" : <Menu size={15} />}
                </button>
              </div>
            </div>
          </div>
          {/* right panel  */}
          <div
            className="w-full  h-full bg-gray-100 p-4   
          [&::-webkit-scrollbar]:w-2
          overflow-y-auto
  [&::-webkit-scrollbar-track]:transparent
  [&::-webkit-scrollbar-thumb]:transparent
  [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
