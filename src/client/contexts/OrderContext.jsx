import { createContext, useEffect, useState,useContext } from "react";
import {UserContext} from "../contexts/context"
import { channel } from "../services/service";

export const OrderContext = createContext();

function OrderProvider({ children }) {


  const {currentUser} = useContext(UserContext)
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    channel.onmessage = async (event) => {
      if (event.data.type === "USER_DATA_UPDATED") {
        const updatedUsers = await db.localUserData.toArray();

        setUserData(updatedUsers);

        const freshCurrentUser = updatedUsers.find(
          (user) => user.id === currentUser.id,
        );

        if (freshCurrentUser) {
          setCurrentUser(freshCurrentUser);
        }
      }
    };
  }, [currentUser.id]);

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
