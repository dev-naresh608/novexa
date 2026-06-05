import React, { useContext } from "react";
import { UserContext } from "../../contexts/context";
import {
  CustomerActiveOrders,
  SellerActiveOrders,
  DriverActiveOrders,
} from "../pages";

function ActiveOrders() {
  const { currentUser, setUserData, setCurrentUser } = useContext(UserContext);

  if (currentUser.role === "customer") {
    return <CustomerActiveOrders />;
  } else if (currentUser.role === "seller") {
    return <SellerActiveOrders />;
  } else {
    return <DriverActiveOrders />;
  }
}

export default ActiveOrders;