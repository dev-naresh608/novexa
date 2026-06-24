import React, { useContext, useEffect, useState } from "react";
import { RatingStar } from "../component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../db";
import {
  ProductContext,
  CartProductContext,
  UserContext,
  WishlistContext,
} from "../../contexts/context";
import ProductImageLoader from "./ProductImageLoader";

import { useParams } from "react-router-dom";
import { Heart, ShoppingCartIcon } from "lucide-react";
import axios from "axios";

function ProductBuyCard({
  name,
  src,
  price,
  id,
  is_product_in_stock,
  is_offer_available,
  offer_price,
}) {

  const { restId } = useParams();
  const { isLogin } = useContext(UserContext);

  const {
    currentUserRole,
    currentUser,
    setCurrentUser,
    userData,
    setUserData,
  } = useContext(UserContext);
  const { wishlist, setWishlist } = useContext(WishlistContext);

  const { cartItems, storeId, setStoreId } = useContext(CartProductContext);

  const [currentQty, setCurrentQty] = useState(0);

  // ============== ADD TO CART ====================
  async function onAddToCart(itemId) {
    if (!isLogin) {
      return toast.error("Login To Buy Items");
    }

    const { data } = await axios.get(`http://localhost:5000/cart/${itemId}`);

    if (!data.success) {
      return toast.error(data.message);
    }

    const productToAdd = data.product;

    const user = currentUser;

    // todo: check if product exist.

    const newProduct = {
      ...productToAdd,
      product_qty: 1,
      store_id: restId,
    };

    // ============== VALIDATION ====================
    const handleUserCanItemInCartFromOnlyOneStore = () => {
      // todo:
      // ! USER CAN ADD 1 ITEM FROM S1 STORE
      // ! AND SECOND ITEM FROM S2 STORE.
      const currentRestId = restId;
      const prevRestId = user.myCart[0]?.store_id;

      if (prevRestId === currentRestId) {
        return true;
      }

      return false;
    };

    if (user.hasOwnProperty("myCart") && user?.myCart?.length > 0) {
      if (handleUserCanItemInCartFromOnlyOneStore()) {
        const isProductAlreadyExist = user.myCart.some((p) => p._id === itemId);

        if (isProductAlreadyExist) {
          toast.info("product already exist");
          return;
        }
        // user.myCart = [...user.myCart, newProduct];
        setCurrentUser((prev) => ({
          ...prev,
          myCart: [...prev.myCart, newProduct],
        }));
      } else {
        alert("first clear previous stores cart");
        return;
      }
    } else {
      // user.myCart = [newProduct];
      setCurrentUser({
        ...currentUser,
        myCart: [newProduct],
      });
    }

    // setCurrentUser(user);
    setStoreId(restId);
    toast.success("Added");
  }

  // ============== INCREASE QUANTITY ====================
  const onIncreaseQty = async (itemId) => {
    const user = currentUser;

    const updatedCart = user.myCart.map((item) => {
      if (item._id === itemId && item.product_qty < 10) {
        return { ...item, product_qty: item.product_qty + 1 };
      }
      return item;
    });

    setUserData({ ...currentUser, user });
    setCurrentUser({ ...currentUser, myCart: updatedCart });
  };

  // ==============DEINCREASE QUANTITY ====================
  const onDecreaseQty = async (itemId) => {
    const user = currentUser;
    const updatedCart = user.myCart
      .map((item) => {
        if (item._id === itemId) {
          return { ...item, product_qty: item.product_qty - 1 };
        }
        return item;
      })
      .filter((item) => item.product_qty > 0);

    setCurrentUser({ ...currentUser, myCart: updatedCart });
  };

  // ============== WISHLIST =======================
  const onAddToWishlist = async (itemId, name) => {
    if (!isLogin) {
      return toast.error("Login To Add Items in Wishlist");
    }

    const { data } = await axios.get(`http://localhost:5000/cart/${itemId}`);

    if (!data.success) {
      return toast.error(data.message);
    }

    const productToAdd = data.product;

    const user = currentUser;

    if (user.hasOwnProperty("myWishlist")) {
      let isProductAlreadyExist = user.myWishlist.some((p) => p._id === itemId);
      if (!isProductAlreadyExist) {

        // if not exist then add the wishlist item.
        setCurrentUser((prev) => ({
          ...prev,
          myWishlist: [...user.myWishlist, productToAdd],
        }));


      } else {

        // if product exist then remove it.
        const remainingProducts = user.myWishlist.filter(
          (p) => p._id !== itemId,
        );
        setCurrentUser({
          ...currentUser,
          myWishlist: remainingProducts
        })
        return toast.success('item removed successfully')
      }

      // setCurrentUser((prev) => ({
      //   ...prev,
      //   myWishlist: [...user.myWishlist, productToAdd],
      // }));
    } else {
      setCurrentUser({ ...currentUser, myWishlist: [productToAdd] });
    }

    toast.success("added in wishlist");
    // console.log(user.hasOwnProperty("myWishlist") && user.myWishlist);
    // setCurrentUser(await db.localUserData.get(currentUser.id));
  };

  // to see currentQty.
  let currentProduct = "";
  let qty = 0;

  useEffect(() => {
    const getQty = async () => {
      const user = currentUser;
      currentProduct = user?.myCart?.find((p) => p._id === id);
      // currentQty = currentProduct?.product_qty || 0;
      qty = (await currentProduct?.product_qty) || 0;
      setCurrentQty(qty);
    };
    getQty();
  }, [onAddToCart, currentUser, cartItems]);

  let isItemInWishlist = false;

  if (currentUser.hasOwnProperty("myWishlist")) {
    isItemInWishlist = currentUser.myWishlist.some(
      (p) => p.product_name === name,
    );
  }

  // ============ OFFER LABEL ================
  const getOfferOffPercentage = (price, offerPrice) => {
    const [offerBackgrounColor, setOfferBackgrounColor] = useState("");
    const result = `-${(((price - offer_price) / price) * 100).toFixed(0)}% `;
    useEffect(() => {
      if (result >= 50) {
        setOfferBackgrounColor("bg-red-600");
      } else if (result < 50 && result >= 30) {
        setOfferBackgrounColor("bg-blue-600");
      } else {
        setOfferBackgrounColor("bg-red-600");
      }
    }, [result]);

    return (
      <>
        <div className={`offer-label ${offerBackgrounColor}`}>
          <div className="offer-label-circle"></div>
          <span className="text-xs font-bold">OFFER</span>
        </div>
        <div
          className={`absolute top-0 right-0 text-white p-2 rounded-[0px_10px_0] ${offerBackgrounColor}`}
        >
          <span>{result}</span>
        </div>
      </>
    );
  };

  // ================ WISHLIST COMPONENT =================
  const WishlistComponent = (isItemInWishlist) => {
    return (
      <>
        {currentUserRole === "customer" && isLogin && (
          // Whishlist
          <div
            className={`${isItemInWishlist ? "bg-[#f3d8d9]" : ""} z-[50] transition-all w-max h-max absolute rounded-full p-2 items-center justify-center 
          hidden group-hover:flex ${is_offer_available ? "right-3 bottom-12" : "right-3"} duration-300`}
          >
            <button
              className="active:scale-95"
              onClick={() => onAddToWishlist(id, name)}
            >
              <Heart
                size={20}
                strokeWidth={1}
                stroke="#c28a90"
                fill={isItemInWishlist ? "#dd484f" : "transparent"}
                paintOrder="stroke"
              />
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="relative border rounded-2xl shadow-md p-2 group overflow-hidden">
        {WishlistComponent(isItemInWishlist)}

        <div className="flex bg-gray-200 rounded-2xl items-center justify-center">
          <ProductImageLoader src={src} alt={name} />
        </div>

        <div className="px-2 my-2 space-y-0.5">
          <p className="w-28 whitespace-nowrap font-semibold capitalize">
            {name}
          </p>

          <RatingStar />

          <div className="flex items-center justify-between">
            <div className="w-28 font-semibold">
              {/* <span className="text-xl text-blue-700">${price} </span>
              <del className="text-gray-500">{(price + Math.ceil((price/10)))}</del> */}

              {is_offer_available && is_product_in_stock ? (
                <>
                  {/* =====OFFER LABEL ======= */}
                  {getOfferOffPercentage(price, offer_price)}
                  <span>
                    <span className="text-md text-blue-700">
                      ${offer_price}
                    </span>{" "}
                    <del className="text-sm text-gray-600">${price}</del>
                  </span>
                  <span className="text-gray-500 text-sm">/pre kg</span>
                </>
              ) : (
                <>
                  <span className="text-md text-blue-700">${price}</span>
                  <span className="text-gray-500 text-sm">/pre kg</span>
                </>
              )}
            </div>

            {currentUserRole === "customer" &&
              (currentQty > 0 ? (
                <div className="flex items-center justify-around px-1.5 border border-green-600 rounded bg-green-100 text-green-700 h-7 w-16 [&>button]:active:scale-95">
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
              ) : is_product_in_stock ? (
                <button
                  className="flex items-center cursor-pointer justify-center gap-1  border border-green-600 h-7 w-16 text-sm px-1.5 py-1 text-green-700 bg-green-100 rounded"
                  onClick={() => onAddToCart(id)}
                >
                  <ShoppingCartIcon size={18} />
                  Add
                </button>
              ) : (
                // <span className="text-red-600 text-nowrap font-semibold text-sm">
                //   Out of Stock
                // </span>
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center transition-all duration-300 rounded-2xl">
                  <span className="bg-red-200 text-red-500 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shadow-md transform scale-100 group-hover:scale-105 transition-transform">
                    Sold Out
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductBuyCard;
