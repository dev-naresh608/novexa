import { createContext, useEffect, useState,useContext } from "react";
import {UserContext} from "./context"

export const OrderContext = createContext();

function OrderProvider({ children }) {
  const {currentUser} = useContext(UserContext)
  const [orders, setOrders] = useState([]);

  return (
    <OrderContext.Provider
      value={{
        orders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
