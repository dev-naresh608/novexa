import React, { useContext, useEffect, useState } from "react";
import CartProductContext from "./CartProductContext";

import { UserContext } from "../contexts/context";

function CartProductContextProvider({ children }) {
  const { currentUser } = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
  const [storeId, setStoreId] = useState(null);
  
  useEffect(() => {
    const getCartItems = async () => {
      const user = currentUser;
      if (user?.hasOwnProperty("myCart")) {
        setCartItems(user.myCart);
      } else {
        setCartItems([]);
      }
    };
    getCartItems();
  }, [currentUser]);

  return (
    <CartProductContext.Provider
      value={{ cartItems, setCartItems, storeId, setStoreId }}
    >
      {children}
    </CartProductContext.Provider>
  );
}

export default CartProductContextProvider;
