import React, { useContext, useEffect, useState } from "react";
import { CartProductContext, UserContext } from "../../contexts/context";
import { db } from "../../db";

function ProductList({ compact = false }) {
  const { cartItems, setCartItems } = useContext(CartProductContext);
  const [totalCartItem, setTotalCartItem] = useState([]);
  const { currentUser, setCurrentUser, setUserData } = useContext(UserContext);

  useEffect(() => {
    if (cartItems?.length > 0) {
      setTotalCartItem(cartItems);
    }
  }, [cartItems]);

  async function onQtyChange(e) {
    const itemId = e.target.id;
    const itemQty = e.target.value;

    const updatedCart = cartItems.map((item) => {
      if (item.product_id === itemId) {
        return { ...item, product_qty: itemQty };
      }
      return item;
    });
    const user = await db.localUserData.get(currentUser.id);
    user.myCart = updatedCart;
    await db.localUserData.put(user);
    setCartItems(user.myCart);
  }

  async function onDeleteItemBtn(productId) {
    const updatedCart = cartItems.filter((p) => p.product_id !== productId);
    const user = await db.localUserData.get(currentUser.id);
    user.myCart = updatedCart;
    await db.localUserData.put(user);
    setCartItems(user.myCart);
    setUserData(await db.localUserData.toArray());
    setCurrentUser(user);
  }

  return (
    <div
      className="space-y-3  overflow-y-auto 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-400
  [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 font-semibold">
        <span>Product Details</span>
        <span>Subtotal</span>
        <span>Action</span>
      </div>

      {cartItems.map((product, index) => (
        <div key={index} className="grid grid-cols-[2fr_1fr_1fr]  px-2">
          <div className="flex items-center">
            <div className="h-24 w-24 border">
              <img
                className="w-full h-full object-contain"
                src={product.product_url}
                alt={product.product_name}
              />
            </div>
            <div className="text-sm px-2">
              <h3 className="font-semibold capitalize">
                {product.product_name}
              </h3>
              <p className="text-gray-500 text-sm">
                Weight: {product.product_weight}
                <span className="text-[10px]">
                  {product.product_weight_type === "none"
                    ? "N/A"
                    : product.product_weight_type}{" "}
                </span>{" "}
              </p>

              <div className="mt-1  space-x-2">
                <span>Qty:</span>
                <select
                  className="border rounded px-1 py-0.5 text-xs bg-white outline-none"
                  value={product.product_qty}
                  onChange={(e) => onQtyChange(e)}
                  id={product.product_id}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="font-semibold w-24">${product.product_price}</span>
          </div>

          <div className="flex items-center">
            <button onClick={() => onDeleteItemBtn(product.product_id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                className="fill-red-500 hover:fill-red-700"
              >
                <path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
