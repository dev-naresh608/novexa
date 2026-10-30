import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/modules/auth/store/authSlice";
import { setStoreId, setGuestCart, clearGuestCart } from "../store/cartSlice";
import { useModal, MODAL_TYPES } from "@/components";
import { toast } from "react-toastify";
import { calculateCartTotals } from "../utils/cartCalculation";
import { onCartPlaceOrder } from "../services/cart.service";
import { handleGetAddressApi } from "../../address/services/address.service.api";
import {
  updateCartQtyApi,
  removeFromCartApi,
  clearCartApi,
} from "../services/cart.api";

/**
 * Custom hook encapsulating cart business logic, reactive state, and item manipulation services.
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const { user: currentUser, isAuthenticated: isLogin } = useSelector(
    (state) => state.auth
  );
  const storeId = useSelector((state) => state.cart.storeId);
  const guestCart = useSelector((state) => state.cart.guestCart || []);

  const isCartDrawerOpen = useSelector((state) => state.cart.isCartDrawerOpen);
  const locationPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isCartRoute = locationPath.includes("/cart");

  const [address, setAddress] = useState(currentUser?.myAddress || currentUser?.address || null);
  const [addressList, setAddressList] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const cartItems = isLogin ? (currentUser?.myCart || []) : guestCart;
  const isCartEmpty = !cartItems || cartItems.length === 0;

  // Sync cached address from Redux if state is empty
  useEffect(() => {
    const cachedAddress = currentUser?.myAddress || currentUser?.address;
    if (cachedAddress && !address) {
      setAddress(cachedAddress);
    }
  }, [currentUser?.myAddress, currentUser?.address, address]);

  // Retrieve delivery addresses whenever drawer opens or user is on /cart
  useEffect(() => {
    const userId = currentUser?._id || currentUser?.id;
    if (!userId || !isLogin) return;
    if (!isCartDrawerOpen && !isCartRoute) return;

    let isMounted = true;
    const fetchAddress = async () => {
      try {
        const data = await handleGetAddressApi(userId);
        if (!isMounted) return;

        if (data && data.success && Array.isArray(data.addressList)) {
          setAddressList(data.addressList);
          if (data.addressList.length > 0) {
            setAddress((prev) => {
              if (prev && data.addressList.some((a) => (a._id || a.id) === (prev._id || prev.id))) {
                return prev;
              }
              const defaultAddr = data.addressList[0];
              dispatch(
                updateUser({
                  myAddress: defaultAddr,
                  address: defaultAddr,
                })
              );
              return defaultAddr;
            });
          } else {
            setAddress(null);
          }
        } else {
          setAddressList([]);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch address in useCart:", err);
          setAddressList([]);
        }
      }
    };

    fetchAddress();
    return () => {
      isMounted = false;
    };
  }, [
    isLogin,
    isCartDrawerOpen,
    isCartRoute,
    currentUser?._id,
    currentUser?.id,
    dispatch,
  ]);

  // Compute subtotal, tax, delivery fee and final price reactively with useMemo
  const orderPriceDetails = useMemo(() => {
    return calculateCartTotals(cartItems);
  }, [cartItems]);

  // Update item quantity inside the cart
  const onCartItemQtyChange = useCallback(
    async (e) => {
      const itemId = e.target.id;
      const itemQty = Number(e.target.value);

      const updatedCart = cartItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, product_qty: itemQty };
        }
        return item;
      });

      if (isLogin) {
        dispatch(updateUser({ myCart: updatedCart }));
        if (currentUser?._id) {
          try {
            await updateCartQtyApi(currentUser._id, itemId, itemQty);
          } catch (error) {
            console.error("Failed to update cart qty in DB:", error);
          }
        }
      } else {
        dispatch(setGuestCart(updatedCart));
      }
    },
    [cartItems, isLogin, currentUser?._id, dispatch]
  );

  // Remove single item from cart
  const onCartItemDeleteBtn = useCallback(
    async (itemId) => {
      const updatedCart = cartItems.filter((item) => item._id !== itemId);

      if (isLogin) {
        dispatch(updateUser({ myCart: updatedCart }));
        if (currentUser?._id) {
          try {
            await removeFromCartApi(currentUser._id, itemId);
          } catch (error) {
            console.error("Failed to remove item from cart DB:", error);
          }
        }
      } else {
        dispatch(setGuestCart(updatedCart));
      }

      if (updatedCart.length === 0) {
        dispatch(setStoreId(null));
      }
      toast.success("Item removed from cart");
    },
    [cartItems, isLogin, currentUser?._id, dispatch]
  );

  // Clear entire cart
  const handleClearCart = useCallback(async () => {
    dispatch(setStoreId(null));

    if (isLogin) {
      dispatch(updateUser({ myCart: [] }));
      if (currentUser?._id) {
        try {
          await clearCartApi(currentUser._id);
          toast.success("Cart cleared successfully");
        } catch (error) {
          console.error("Failed to clear cart in DB:", error);
        }
      }
    } else {
      dispatch(clearGuestCart());
      toast.success("Cart cleared successfully");
    }
  }, [isLogin, currentUser?._id, dispatch]);

  // Change payment method
  const handlePaymentMethod = useCallback((e) => {
    setPaymentMethod(e.target.value);
  }, []);

  // Submit order placement request with double-click prevention & loader
  const handlePlaceOrder = useCallback(async () => {
    if (isPlacingOrder) return;

    if (!isLogin) {
      toast.info("Please log in to place your order");
      openModal(MODAL_TYPES.LOGIN);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!address) {
      toast.error("Please add or select a delivery address");
      openModal(MODAL_TYPES.ADDRESS, {
        userId: currentUser?._id || currentUser?.id,
        setAddress: (newAddr) => {
          setAddress(newAddr);
          setAddressList((prev) => (prev ? [newAddr, ...prev] : [newAddr]));
          dispatch(updateUser({ myAddress: newAddr, address: newAddr }));
        },
      });
      return;
    }

    const resolvedStoreId =
      storeId ||
      cartItems[0]?.store_id ||
      cartItems[0]?.storeId;

    if (!resolvedStoreId) {
      toast.error("Could not determine store information. Please re-add items.");
      return;
    }

    if (!storeId && resolvedStoreId) {
      dispatch(setStoreId(resolvedStoreId));
    }

    setIsPlacingOrder(true);
    try {
      await onCartPlaceOrder(
        currentUser,
        (updatedUser) => dispatch(updateUser(updatedUser)),
        resolvedStoreId,
        orderPriceDetails,
        address,
        paymentMethod,
        navigate,
        dispatch,
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }, [
    isPlacingOrder,
    isLogin,
    openModal,
    currentUser,
    cartItems,
    storeId,
    orderPriceDetails,
    address,
    paymentMethod,
    navigate,
    dispatch,
  ]);

  const effectiveUser = useMemo(() => {
    return isLogin
      ? currentUser
      : { role: "customer", myCart: guestCart };
  }, [isLogin, currentUser, guestCart]);

  return {
    currentUser: effectiveUser,
    setCurrentUser: (updater) => isLogin && dispatch(updateUser(updater)),
    isLogin,
    storeId,
    setStoreId: (id) => dispatch(setStoreId(id)),
    address,
    setAddress,
    addressList,
    setAddressList,
    paymentMethod,
    isAddressFormOpen,
    setIsAddressFormOpen,
    isCartEmpty,
    cartItems,
    isPlacingOrder,
    orderPriceDetails,
    onCartItemQtyChange,
    onCartItemDeleteBtn,
    handleClearCart,
    handlePaymentMethod,
    handlePlaceOrder,
  };
};
