import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeCartDrawer } from "../store/cartSlice";
import { useCart } from "../hooks/useCart";
import { useModal, MODAL_TYPES } from "@/components";
import {
  ShoppingCart,
  X,
  Trash2,
  MapPin,
  CreditCard,
  ArrowRight,
  ShoppingBasket,
  Plus,
  Minus,
  CheckCircle2,
  Loader2,
  PlusCircle,
} from "lucide-react";
import AddressSelector from "./address/AddressSelector";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const isCartDrawerOpen = useSelector((state) => state.cart.isCartDrawerOpen);

  const {
    currentUser,
    setCurrentUser,
    isLogin,
    address,
    setAddress,
    addressList,
    setAddressList,
    paymentMethod,
    orderPriceDetails,
    onCartItemQtyChange,
    onCartItemDeleteBtn,
    handleClearCart,
    handlePaymentMethod,
    handlePlaceOrder,
    isCartEmpty,
    cartItems: activeCartItems,
    isPlacingOrder,
  } = useCart();

  // Close drawer on ESC press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        dispatch(closeCartDrawer());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartDrawerOpen, dispatch]);

  if (typeof document === "undefined") return null;

  const userRole = currentUser?.role || "customer";
  if (isLogin && (userRole === "driver" || userRole === "seller")) {
    return null;
  }

  const handleClose = () => {
    if (isPlacingOrder) return;
    dispatch(closeCartDrawer());
  };

  const handleCheckoutOrder = () => {
    if (isPlacingOrder) return;
    if (!isLogin) {
      dispatch(closeCartDrawer());
    }
    handlePlaceOrder();
  };

  const handleOpenAddAddressModal = () => {
    const targetUserId = currentUser?._id || currentUser?.id;
    openModal(MODAL_TYPES.ADDRESS, {
      userId: targetUserId,
      setAddress: (newAddr) => {
        setAddress(newAddr);
        if (setAddressList) {
          setAddressList((prev) => (prev ? [newAddr, ...prev] : [newAddr]));
        }
      },
    });
  };

  const cartItems = activeCartItems || currentUser?.myCart || [];
  const itemCount = cartItems.length;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        isCartDrawerOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-full sm:w-[450px] md:w-[480px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isCartDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-green-700 text-white flex items-center justify-center shadow-md shadow-green-700/20">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">
                Your Cart
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {itemCount} {itemCount === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCartEmpty && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border border-red-100 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer border-none bg-transparent"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable */}
        {isCartEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-green-50 text-green-700 rounded-3xl flex items-center justify-center mb-4 border border-green-100 shadow-sm">
              <ShoppingBasket className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Your cart is empty
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
              Explore our fresh local grocery stores and add your favorite items to start shopping!
            </p>
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate("/stores");
              }}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl shadow-md shadow-green-700/20 transition-all cursor-pointer border-none"
            >
              <span>Explore Stores</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Cart Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Cart Items ({itemCount})</span>
              </div>

              <div className="space-y-2.5">
                {cartItems.map((item, index) => {
                  const isOfferActive = Boolean(item.isOfferAvailable || item.is_offer_available);
                  const effectivePrice = isOfferActive
                    ? Number(item.product_offer_price || item.product_selling_price || 0)
                    : Number(item.product_selling_price || 0);
                  const itemSubtotal = (effectivePrice * (Number(item.product_qty) || 1)).toFixed(2);

                  return (
                    <div
                      key={item._id || index}
                      className="flex gap-3 p-3 bg-gray-50/70 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-xl bg-white border border-gray-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        {item.product_url ? (
                          <img
                            src={item.product_url}
                            alt={item.product_name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        ) : (
                          <ShoppingBasket className="w-6 h-6 text-gray-300" />
                        )}
                      </div>

                      {/* Product Info & Controls */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">
                              {item.product_name}
                            </h4>
                            {item.product_weight && (
                              <p className="text-[11px] text-gray-400 font-medium">
                                {item.product_weight}
                                {item.product_weight_type === "none"
                                  ? ""
                                  : ` ${item.product_weight_type}`}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onCartItemDeleteBtn(item._id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer border-none bg-transparent"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700">
                            <span>Qty:</span>
                            <select
                              id={item._id}
                              value={item.product_qty}
                              onChange={onCartItemQtyChange}
                              className="bg-transparent outline-none font-bold text-gray-900 cursor-pointer"
                            >
                              {[...Array(10)].map((_, i) => (
                                <option key={i} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="text-right">
                            <div className="flex items-baseline justify-end gap-1">
                              <span className="text-sm font-bold text-gray-900">
                                ₹{itemSubtotal}
                              </span>
                            </div>
                            {isOfferActive && item.product_selling_price && (
                              <del className="text-[10px] text-gray-400 font-medium">
                                ₹{(Number(item.product_selling_price) * (Number(item.product_qty) || 1)).toFixed(2)}
                              </del>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address Section */}
            {isLogin ? (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-green-700" />
                    Delivery Address
                  </h3>
                  <button
                    type="button"
                    onClick={handleOpenAddAddressModal}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer border-none bg-transparent outline-none"
                  >
                    {addressList && addressList.length > 0 ? "+ Add New" : "+ Add"}
                  </button>
                </div>

                {!addressList && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50 text-xs text-gray-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                    <span>Loading address...</span>
                  </div>
                )}

                {addressList && addressList.length === 0 && (
                  <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 text-center space-y-1.5">
                    <p className="text-xs text-amber-800 font-medium">No saved delivery address found.</p>
                    <button
                      type="button"
                      onClick={handleOpenAddAddressModal}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs border-none"
                    >
                      + Add Delivery Address
                    </button>
                  </div>
                )}

                {addressList && addressList.length > 0 && (
                  <AddressSelector
                    addressList={addressList}
                    address={address}
                    selectedAddress={address}
                    setAddress={setAddress}
                    onSelectAddress={setAddress}
                    setCurrentUser={setCurrentUser}
                  />
                )}
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-green-700" />
                  Delivery Address
                </h3>
                <p className="bg-gray-50 rounded-xl border border-gray-200/80 text-xs px-3 py-2 text-gray-500">
                  Login to select or add your delivery address.
                </p>
              </div>
            )}

            {/* Payment Method Section */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-green-700" />
                Payment Options
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === "cashOnDelivery"
                      ? "border-green-600 bg-green-50/60 text-green-800 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethodDrawer"
                    value="cashOnDelivery"
                    checked={paymentMethod === "cashOnDelivery"}
                    onChange={handlePaymentMethod}
                    className="accent-green-600"
                  />
                  Cash on Delivery
                </label>

                <label
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-green-600 bg-green-50/60 text-green-800 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethodDrawer"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={handlePaymentMethod}
                    className="accent-green-600"
                  />
                  Online Payment
                </label>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2 bg-gray-50/80 p-3.5 rounded-2xl border">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ₹{Number(orderPriceDetails?.subTotal || orderPriceDetails?.subtotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>GST & Taxes (2%)</span>
                <span className="font-semibold text-gray-800">
                  ₹{Number(orderPriceDetails?.taxPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-gray-800">
                  {orderPriceDetails?.deliveryCharge === 0 ? (
                    <span className="text-green-600 font-bold">Free</span>
                  ) : (
                    `₹${Number(orderPriceDetails?.deliveryCharge || 0).toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200/80">
                <span>Total Amount</span>
                <span className="text-green-700">
                  ₹{Number(orderPriceDetails?.finalPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer / Place Order CTA */}
        {!isCartEmpty && (
          <div className="p-4 border-t border-gray-100 bg-white shadow-lg">
            <button
              type="button"
              disabled={isPlacingOrder}
              onClick={handleCheckoutOrder}
              className={`w-full flex items-center justify-between bg-green-700 hover:bg-green-800 text-white font-bold text-sm py-3.5 px-5 rounded-2xl shadow-lg shadow-green-700/25 transition-all border-none select-none ${
                isPlacingOrder
                  ? "opacity-75 cursor-not-allowed bg-green-800"
                  : "active:scale-[0.99] cursor-pointer"
              }`}
            >
              {isPlacingOrder ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Placing Order...</span>
                </div>
              ) : (
                <span>{isLogin ? "Place Order" : "Login to Place Order"}</span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-extrabold">
                  ₹{Number(orderPriceDetails?.finalPrice || 0).toFixed(2)}
                </span>
                {!isPlacingOrder && <ArrowRight className="w-4 h-4" />}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
