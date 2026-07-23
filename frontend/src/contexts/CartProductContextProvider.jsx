import React, { useContext, useEffect, useState } from "react";
import CartProductContext from "./CartProductContext";
import { UserContext } from "./context";
import { getCartApi } from "../modules/cart/services/cart.api";

function CartProductContextProvider({ children }) {
  const { currentUser, setCurrentUser, isLogin } = useContext(UserContext);

  const [cartItems, setCartItems] = useState([]);
  const [storeId, setStoreId] = useState(null);

  // Sync cart from DB on login / load
  useEffect(() => {
    const fetchCart = async () => {
      if (!isLogin || !currentUser?._id) return;
      try {
        const response = await getCartApi(currentUser._id);
        if (response && response.success) {
          const dbCart = response.result || [];
          setCurrentUser((prev) => ({
            ...prev,
            myCart: dbCart,
          }));
          if (dbCart.length > 0 && dbCart[0].store_id) {
            setStoreId(dbCart[0].store_id);
          }
        }
      } catch (error) {
        console.error("Failed to load cart from DB:", error);
      }
    };
    fetchCart();
  }, [isLogin, currentUser?._id, setCurrentUser]);

  useEffect(() => {
    const getCartItems = async () => {
      const user = currentUser;
      if (user?.hasOwnProperty("myCart")) {
        setCartItems(user.myCart);
        if (user.myCart.length > 0 && user.myCart[0].store_id) {
          setStoreId(user.myCart[0].store_id);
        } else if (user.myCart.length === 0) {
          setStoreId(null);
        }
      } else {
        setCartItems([]);
        setStoreId(null);
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
