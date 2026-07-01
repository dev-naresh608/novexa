import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserContext,
  CartProductContext,
  AddressContext,
} from "../../../contexts/context";

import {
  EmptyCart,
  CartItems,
  GoBackButton,
  OrderSummary,
  handleAddAddressApi,
  handleGetAddressApi,
  onCartPlaceOrder,
  generateAddressLine,
} from "../../index";

import axios from "axios";
import { toast } from "react-toastify";
import { datalist } from "framer-motion/client";

function CartPage() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  let { storeId, setStoreId } = useContext(CartProductContext);

  const navigate = useNavigate();

  // ============= STATES ==============
  const [address, setAddress] = useState("");
  const [addressList, setAddressList] = useState(null);
  const [subTotal, setSubTotal] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [orderPriceDetails, setOrderPriceDetails] = useState({});
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isCartEmpty, setIsCartEmpty] = useState(true);

  useEffect(() => {
    if (
      !currentUser.hasOwnProperty("myCart") ||
      currentUser?.myCart?.length === 0
    ) {
      return setIsCartEmpty(true);
    } else {
      return setIsCartEmpty(false);
    }
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    // ============= fetch all address =================
    const fetchAddress = async () => {
      const data = await handleGetAddressApi(currentUser._id);
      if (!data.success) {
        // return toast.error(data.message);
        return;
      }
      setAddressList(data.addressList);
      setAddress(data.addressList[0])
      setCurrentUser((prev) => ({
        ...prev,
        address: data.addressList[0],
      }));
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    if (currentUser.myCart?.length > 0) {
      const price = currentUser.myCart.reduce((acc, product) => {
        return acc + product.product_selling_price * product.product_qty;
      }, 0);

      setSubTotal(price);

      const tax = (price * 0.02).toFixed(2);
      setFinalPrice(price + tax);
      setTaxPrice(tax);

      const deliver_charge = 0;

      setOrderPriceDetails({
        subTotal,
        deliveryCharge,
        taxPrice,
        finalPrice,
      });

      setDeliveryCharge(deliver_charge);
    } else {
      setSubTotal(0);
      setTaxPrice(0);
      setFinalPrice(0);
      setDeliveryCharge(0);
      setOfferPrice(0);
    }
  }, [currentUser.myCart, finalPrice]);

  if (isCartEmpty) {
    return <EmptyCart />;
  }
  let currentUserAddress = "";
  const isAddressAvailable = currentUser.hasOwnProperty("myAddress");

  if (isAddressAvailable) {
    currentUserAddress = `${currentUser.myAddress.name} ${currentUser.myAddress.phone} ${currentUser.myAddress.street} ${currentUser.myAddress.city} ${currentUser.myAddress.state}, ${currentUser.myAddress.pincode} `;
  }

  // ================ HANDLE PAYMENT FUN ====================
  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  // ================ ON PLACE ORDER ====================

  return (
    <>
      <section className="bg-white rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT - CART ITEMS */}
          <div className="flex-1 relative rounded-2xl border p-2">
            <div className="flex justify-between items-end border-b pb-2 mb-3 px-2 font-semibold">
              <span className="text-2xl">Shopping Cart</span>

              <span className="text-indigo-600 text-sm">
                {currentUser.myCart?.length || 0} items
              </span>
            </div>

            {/* ============ PRODUCT LIST ============== */}
            <>
              <CartItems
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            </>
            <GoBackButton navigation="/stores">Continue Shoping</GoBackButton>
          </div>

          {/* ============ ORDER SUMMARY ============== */}
          <OrderSummary
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onPlaceOrder={onCartPlaceOrder}
            handlePaymentMethod={handlePaymentMethod}
            paymentMethod={paymentMethod}
            orderPriceDetails={orderPriceDetails}
            addressList={addressList}
            address={address}
            setAddress={setAddress}
            isAddressFormOpen={isAddressFormOpen}
            setIsAddressFormOpen={setIsAddressFormOpen}
            userId={currentUser._id}
            storeId={storeId}
          />
        </div>
      </section>
    </>
  );
}

export default CartPage;
