import React, { useContext, useEffect, useState } from "react";
import CartProductContext from "./cartProductContext";
import { db } from "../db";
import { UserContext } from "../contexts/context";

function CartProductContextProvider({ children }) {
  const { currentUser } = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const getCartItems = async () => {
      const user = await db.localUserData.get(currentUser?.id);
      if (user?.hasOwnProperty("myCart")) {
        setCartItems(user.myCart);
      } else {
        setCartItems([]);
      }
    };
    getCartItems();
  }, [currentUser]);

  return (
    <CartProductContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartProductContext.Provider>
  );
}

export default CartProductContextProvider;
