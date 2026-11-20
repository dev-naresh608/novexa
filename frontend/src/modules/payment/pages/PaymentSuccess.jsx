import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Receipt,
  ShieldCheck,
  Loader2,
  ExternalLink,
  Home,
  Clock,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { toast } from "react-toastify";
import { updateUser } from "@/modules/auth/store/authSlice";
import { clearCartState } from "@/modules/cart/store/cartSlice";
import { fetchUnreadCountThunk } from "@/modules/notification/store/notificationSlice";
import { verifyPaymentSessionApi } from "../services/payment.api";

const formatAmount = (amount, currency = "inr") => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: String(currency || "inr").toUpperCase(),
    }).format(Number(amount) || 0);
  } catch {
    return `₹${(Number(amount) || 0).toFixed(2)}`;
  }
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { isCheckingAuth, user } = useSelector((state) => state.auth);

  const sessionId = searchParams.get("session_id");
  const orderIdParam = searchParams.get("order_id");

  // loading | paid | processing | unpaid | error
  const [status, setStatus] = useState(sessionId ? "loading" : "error");
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(
    sessionId ? null : "Missing payment reference. Please check your orders.",
  );
  const handledRef = useRef(false);
  const userId = user?._id || user?.id;

  useEffect(() => {
    // Wait for the session restore after the Stripe redirect so the cart we
    // clear below isn't overwritten by a late /me response.
    if (!sessionId || isCheckingAuth) return;

    let isMounted = true;

    const verifyPayment = async () => {
      try {
        const data = await verifyPaymentSessionApi(sessionId);
        if (!isMounted) return;

        if (!data?.success) {
          setStatus("error");
          setError(data?.message || "Could not verify payment session");
          return;
        }

        setSessionData(data);

        if (data.paid) {
          setStatus("paid");
          if (!handledRef.current) {
            handledRef.current = true;
            dispatch(updateUser({ myCart: [] }));
            dispatch(clearCartState());
            if (userId) dispatch(fetchUnreadCountThunk(userId));
            toast.success("Payment successful! Your order has been placed 🎉");
          }
        } else if (data.sessionStatus === "complete") {
          // Payment submitted but not settled yet (e.g. delayed methods)
          setStatus("processing");
        } else {
          setStatus("unpaid");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Payment verification error:", err);
        setStatus("error");
        setError(
          err.response?.data?.message || "Unable to confirm payment with Stripe",
        );
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, isCheckingAuth, dispatch, userId]);

  const displayOrderId = sessionData?.order?._id || orderIdParam || "";
  const totalAmount =
    sessionData?.amountTotal || sessionData?.order?.price_detail?.finalPrice || null;

  if (status === "loading") {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 max-w-xl mx-auto font-sans">
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-emerald-500/5 p-6 sm:p-8 text-center">
          <div className="py-12 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Verifying Payment...</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Securely communicating with Stripe to confirm your transaction details.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status !== "paid") {
    const isProcessing = status === "processing";
    const title = isProcessing
      ? "Payment Is Processing"
      : status === "unpaid"
        ? "Payment Not Completed"
        : "Could Not Verify Payment";
    const message = isProcessing
      ? "Stripe has received your payment and is still confirming it. Your order will be sent to the store as soon as the payment clears."
      : status === "unpaid"
        ? "This payment was not completed, so no money was taken. Your items are still in your cart."
        : error ||
          "We couldn't confirm your payment right now. If money was deducted, your order will be updated automatically — please check your orders.";

    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 max-w-xl mx-auto font-sans">
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-amber-500/5 p-6 sm:p-8 text-center space-y-6">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-sm border ${
              isProcessing
                ? "bg-blue-50 text-blue-600 border-blue-200/80"
                : "bg-amber-50 text-amber-600 border-amber-200/80"
            }`}
          >
            {isProcessing ? (
              <Clock className="w-10 h-10" strokeWidth={2} />
            ) : (
              <XCircle className="w-10 h-10" strokeWidth={2} />
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              {message}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              to={isProcessing ? "/orders" : "/cart"}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <Package className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              <span>{isProcessing ? "View My Orders" : "Return to Cart"}</span>
            </Link>
            <Link
              to="/orders"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
            >
              <Home className="w-3.5 h-3.5 text-gray-500" />
              <span>Check Order History</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 max-w-xl mx-auto font-sans">
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-emerald-500/5 p-6 sm:p-8 text-center space-y-6">
        {/* Success Icon Badge */}
        <div className="relative inline-block mx-auto">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Payment Completed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Thank you for your purchase. Your payment has been processed securely via Stripe.
          </p>
        </div>

        {/* Transaction Receipt Card */}
        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 text-left space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-200/80 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5 text-gray-700">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Payment Summary
            </span>
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Paid Online
            </span>
          </div>

          {displayOrderId && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-mono font-bold text-gray-900">
                #{String(displayOrderId).slice(-8)}
              </span>
            </div>
          )}

          {totalAmount !== null && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-bold text-emerald-700 text-sm">
                {formatAmount(totalAmount, sessionData?.currency)}
              </span>
            </div>
          )}

          {sessionData?.customerEmail && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Receipt Email:</span>
              <span className="font-medium text-gray-700 truncate max-w-[200px]">
                {sessionData.customerEmail}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Payment Gateway:</span>
            <span className="font-semibold text-gray-800">Stripe</span>
          </div>

          {sessionId && (
            <div className="pt-1.5 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-400">
              <span>Session Reference:</span>
              <span className="font-mono truncate max-w-[170px]" title={sessionId}>
                {sessionId.slice(0, 20)}...
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            to="/active-orders"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Track Active Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2.5">
            {displayOrderId && (
              <Link
                to={`/orders/${displayOrderId}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all shadow-2xs"
              >
                <span>View Order Details</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            )}

            <Link
              to="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all"
            >
              <Home className="w-3.5 h-3.5 text-gray-500" />
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
