import React, { useContext, useEffect, useState } from "react";
import RatingStart from "../RatingStar/RatingStar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../db";
import {
  ProductContext,
  CartProductContext,
  UserContext,
  WishlistContext,
} from "../../contexts/context";
import ProductImageLoader from "./ProductImageLoader";

function ProductBuyCard({ price, id, src, name, isProductInStock }) {
  const { isLogin } = useContext(UserContext);
  const { productsList } = useContext(ProductContext);
  const {
    currentUserRole,
    currentUser,
    setCurrentUser,
    userData,
    setUserData,
  } = useContext(UserContext);
  const { wishlist, setWishlist } = useContext(WishlistContext);

  const [currentQty, setCurrentQty] = useState(0);

  async function onAddToCart(itemId) {
    if (!isLogin) {
      return toast.error("Login To Buy Items");
    }
    const productToAdd = productsList.find((p) => p.product_id === itemId);

    if (!productToAdd) return;

    const user = await db.localUserData.get(currentUser.id);

    // todo: check if product exist.

    const newProduct = {
      ...productToAdd,
      product_qty: 1,
    };

    if (user.hasOwnProperty("myCart")) {
      const isProductAlreadyExist = user.myCart.some(
        (p) => p.product_id === itemId,
      );
      if (isProductAlreadyExist) {
        toast.info("product already exist");
        return;
      }
      user.myCart = [...user.myCart, newProduct];
    } else {
      user.myCart = [newProduct];
    }

    await db.localUserData.put(user);

    setUserData(await db.localUserData.toArray());
    setCurrentUser(user);

    toast.success("Added");
  }

  const onIncreaseQty = async (itemId) => {
    const user = await db.localUserData.get(currentUser.id);

    user.myCart = user.myCart.map((item) => {
      if (item.product_id === itemId && item.product_qty < 10) {
        return { ...item, product_qty: item.product_qty + 1 };
      }
      return item;
    });
    await db.localUserData.put(user);
    setUserData(await db.localUserData.toArray());
    setCurrentUser(user);
  };

  const onDecreaseQty = async (itemId) => {
    const user = await db.localUserData.get(currentUser.id);
    user.myCart = user.myCart
      .map((item) => {
        if (item.product_id === itemId) {
          return { ...item, product_qty: item.product_qty - 1 };
        }
        return item;
      })
      .filter((item) => item.product_qty > 0);

    await db.localUserData.put(user);
    setUserData(await db.localUserData.toArray());
    setCurrentUser(user);
  };

  const onAddToWishlist = async (itemId, name) => {
    if (!isLogin) {
      return toast.error("Login To Add Items in Wishlist");
    }
    const productToAdd = productsList.find((p) => p.product_name === name);

    if (!productToAdd) return;

    const user = await db.localUserData.get(currentUser.id);
    if (user.hasOwnProperty("myWishlist")) {
      let isProductAlreadyExist = user.myWishlist.some(
        (p) => p.product_id === itemId,
      );
      if (!isProductAlreadyExist) {
        user.myWishlist = [...user.myWishlist, productToAdd];
      } else {
        // if product exist then remove it.
        const remainingProducts = user.myWishlist.filter(
          (p) => p.product_id !== itemId,
        );
        user.myWishlist = remainingProducts;
      }
    } else {
      user.myWishlist = [productToAdd];
    }

    // console.log(user.hasOwnProperty("myWishlist") && user.myWishlist);
    await db.localUserData.put(user);
    setUserData(await db.localUserData.toArray());
    setCurrentUser(await db.localUserData.get(currentUser.id));
  };

  // to see currentQty.
  let currentProduct = "";
  let qty = 0;

  useEffect(() => {
    // console.log("run");
    const getQty = async () => {
      const user = await db.localUserData.get(currentUser.id);
      currentProduct = user?.myCart?.find((p) => p.product_id === id);

      // currentQty = currentProduct?.product_qty || 0;
      qty = (await currentProduct?.product_qty) || 0;
      setCurrentQty(qty);
    };
    getQty();
  }, [onAddToCart, currentUser]);

  let isItemInWishlist = false;

  if (currentUser.hasOwnProperty("myWishlist")) {
    isItemInWishlist = currentUser.myWishlist.some(
      (p) => p.product_name === name,
    );
  }

  return (
    <>
      <div className="relative border border-black  rounded-2xl shadow-md px-2 py-3 group">
        {currentUserRole === "customer" && isLogin && (
          // Whishlist
          <div
            className={`${isItemInWishlist ? "bg-[#f3d8d9]" : ""} w-max h-max absolute rounded-full p-2 items-center justify-center 
          hidden group-hover:flex right-3 transition-all duration-300`}
          >
            <button onClick={() => onAddToWishlist(id, name)}>
              <svg
                xmlns="http://w3.org"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill={isItemInWishlist ? "#dd484f" : "transparent"}
                stroke="#c28a90"
                strokeWidth="20"
                style={{
                  paintOrder: "stroke",
                }}
              >
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-center">
          <ProductImageLoader src={src} alt={name} />
        </div>

        <div className="px-2 mb-3">
          <p className="w-28 whitespace-nowrap">{name}</p>

          <RatingStart />

          <div className="flex items-center justify-between mt-2">
            <p className="w-28 font-semibold">
              {/* <span className="text-xl text-blue-700">${price} </span>
              <del className="text-gray-500">{(price + Math.ceil((price/10)))}</del> */}
              <span className="text-xl text-blue-700">${price}</span>
              <span className="text-gray-500 text-sm">/pre kg</span>
            </p>

            {currentUserRole === "customer" &&
              (currentQty > 0 ? (
                <div className="flex items-center justify-around px-1.5 border border-green-600  rounded-md bg-green-100 text-green-700 h-7 w-16">
                  <button
                    onClick={() => onDecreaseQty(id)}
                    className="font-bold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#15803D"
                    >
                      <path d="M200-440v-80h560v80H200Z" />
                    </svg>
                  </button>
                  <p>{currentQty}</p>

                  <button
                    onClick={() => onIncreaseQty(id)}
                    className="font-bold"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="18px"
                      viewBox="0 -960 960 960"
                      width="18px"
                      fill="#15803D"
                    >
                      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                    </svg>
                  </button>
                </div>
              ) : isProductInStock ? (
                <button
                  className="flex items-center cursor-pointer justify-center gap-1  border border-green-600 h-7 w-16 text-sm px-1.5 py-1 text-green-700 bg-green-100 rounded"
                  onClick={() => onAddToCart(id)}
                >
                  <img
                    className="w-3.5"
                    alt="cart_icon"
                    src="data:image/svg+xml,%3csvg%20width='14'%20height='14'%20viewBox='0%200%2014%2014'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_3333_269)'%3e%3cpath%20d='M0.583008%200.583008H2.91634L4.47967%208.39384C4.53302%208.6624%204.67912%208.90365%204.89241%209.07535C5.1057%209.24705%205.37258%209.33825%205.64634%209.33301H11.3163C11.5901%209.33825%2011.857%209.24705%2012.0703%209.07535C12.2836%208.90365%2012.4297%208.6624%2012.483%208.39384L13.4163%203.49967H3.49967M5.83301%2012.2497C5.83301%2012.5718%205.57184%2012.833%205.24967%2012.833C4.92751%2012.833%204.66634%2012.5718%204.66634%2012.2497C4.66634%2011.9275%204.92751%2011.6663%205.24967%2011.6663C5.57184%2011.6663%205.83301%2011.9275%205.83301%2012.2497ZM12.2497%2012.2497C12.2497%2012.5718%2011.9885%2012.833%2011.6663%2012.833C11.3442%2012.833%2011.083%2012.5718%2011.083%2012.2497C11.083%2011.9275%2011.3442%2011.6663%2011.6663%2011.6663C11.9885%2011.6663%2012.2497%2011.9275%2012.2497%2012.2497Z'%20stroke='%234FBF8B'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_3333_269'%3e%3crect%20width='14'%20height='14'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                  ></img>
                  Add
                </button>
              ) : (
                <span className="text-red-600 text-nowrap font-semibold text-sm">
                  Out of Stock
                </span>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductBuyCard;
