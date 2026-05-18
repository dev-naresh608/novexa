import React, { useState } from "react";
import UserContext from "./UserContext";
import { db } from "../db";

import {
  LayoutDashboard,
  Shapes,
  Receipt,
  Heart,
  ShoppingCart,
  MessageCircle,
  Smile,
  CircleHelp,
  HelpCircle,
  SettingsIcon,
} from "lucide-react";
import { Setting } from "../components";

function UserContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    password: "",
    id: "",
  });
  const [currentUserRole, setCurrentUserRole] = useState("customer");
  let data = null;
  const [userData, setUserData] = useState(null);

  // const getUserData = async () => {
  //   data = (await db.localUserData.toArray()) || {
  //     username: "",
  //     email: "",
  //     password: "",
  //     role: "",
  //     id: "",
  //   };
  //   setUserData(data);
  // };
  // getUserData();

  const [activeTab, setActiveTab] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const [isNotificationClicked, setIsNotificationClicked] = useState(false);

  const leftPanelItems = [
    {
      children: "Dashboard",
      to: "/dashboard",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          id="widgets"
          className="group-hover:fill-white fill-current"
        >
          <path fill="none" d="M0 0h24v24H0V0z"></path>
          <path d="M13 14v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1zm-9 7h6c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1zM3 4v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1zm12.95-1.6L11.7 6.64c-.39.39-.39 1.02 0 1.41l4.25 4.25c.39.39 1.02.39 1.41 0l4.25-4.25c.39-.39.39-1.02 0-1.41L17.37 2.4c-.39-.39-1.03-.39-1.42 0z"></path>
        </svg>
      ),
      showToCustomer: true,
      showToSeller: true,
      showToAdmin: false,
      showToDriver: true,
    },
    {
      children: "Categories",
      to: "/categories",
      svg: "🏷️",
      showToCustomer: true,
      showToSeller: false,
      showToAdmin: false,
      showToDriver: false,
    },
    {
      children: "All Products",
      to: "/allproducts",
      svg: "🛍️",
      showToCustomer: true,
      showToSeller: true,
      showToAdmin: false,
      showToDriver: false,
    },
    {
      children: "Favourite",
      to: "/wishlist",
      svg: <Heart />,
      showToCustomer: true,
      showToSeller: false,
      showToAdmin: false,
      showToDriver: false,
    },
    {
      children: "Cart",
      to: "/cart",
      svg: "🛒",
      showToCustomer: true,
      showToSeller: false,
      showToAdmin: false,
      showToDriver: false,
    },

    // for seller

    {
      children: "Add Products",
      to: "/addproducts",
      svg: "📋",
      showToCustomer: false,
      showToSeller: true,
      showToAdmin: false,
      showToDriver: false,
    },
    {
      children: "Product List",
      to: "/product-list",
      svg: "📜",
      showToCustomer: false,
      showToSeller: true,
      showToAdmin: false,
      showToDriver: false,
    },
    {
      children: "Orders",
      to: "/orders",
      svg: "📦",
      showToCustomer: true,
      showToSeller: true,
      showToAdmin: false,
      showToDriver: true,
    },

    // for driver
    {
      children: "Active Deliveries",
      to: "/activeDeliveries",
      svg: "🛵",
      showToCustomer: false,
      showToSeller: false,
      showToAdmin: false,
      showToDriver: true,
    },
    {
      children: " Delivery History",
      to: "/deliveryHistory",
      svg: "⟲",
      showToCustomer: false,
      showToSeller: false,
      showToAdmin: false,
      showToDriver: true,
    },
    {
      children: "Earnings",
      to: "/earnings",
      svg: "💰",
      showToCustomer: false,
      showToSeller: false,
      showToAdmin: false,
      showToDriver: true,
    },
    {
      children: "Vehicle Details",
      to: "/vehicleDetails",
      svg: "🚗",
      showToCustomer: false,
      showToSeller: false,
      showToAdmin: false,
      showToDriver: true,
    },
  ];

  const secondLeftPanelItems = [
    {
      children: "Feedback",
      to: "/dashboard",
      svg: Smile,
      showToCustomer: true,
      showToSeller: true,
      showToAdmin: false,
      showToDriver: false,
    },
    {
      children: "Help",
      to: "/",
      svg: HelpCircle,
      showToCustomer: true,
      showToSeller: true,
      showToDriver: true,
      showToAdmin: false,
    },
  ];
  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        currentUser,
        setCurrentUser,
        currentUserRole,
        setCurrentUserRole,
        activeTab,
        setActiveTab,
        isLogin,
        setIsLogin,
        leftPanelItems,
        secondLeftPanelItems,
        isProfileClicked,
        setIsProfileClicked,
        isNotificationClicked,
        setIsNotificationClicked,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
