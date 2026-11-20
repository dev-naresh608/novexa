import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  ShoppingCart,
  Store,
  Home,
  HelpCircle,
} from "lucide-react";
import { cancelPaymentApi } from "../services/payment.api";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");
  const { isCheckingAuth, isAuthenticated } = useSelector((state) => state.auth);
  const cancelRequestedRef = useRef(false);

  // Cancel the unpaid order (and expire its Stripe session) once the login
  // session has been restored after the redirect back from Stripe.
  useEffect(() => {
    if (!orderId || isCheckingAuth || !isAuthenticated) return;
    if (cancelRequestedRef.current) return;
    cancelRequestedRef.current = true;

    cancelPaymentApi(orderId)
      .then((data) => {
        if (data?.paid) {
          toast.success("Your payment went through — your order has been placed!");
          navigate("/active-orders", { replace: true });
        }
      })
      .catch((error) => {
        console.error("Failed to cancel unpaid order:", error);
      });
  }, [orderId, isCheckingAuth, isAuthenticated, navigate]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 max-w-xl mx-auto font-sans">
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-amber-500/5 p-6 sm:p-8 text-center space-y-6">
        {/* Cancel Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-10 h-10" strokeWidth={2} />
        </div>

        {/* Header Text */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Payment Incomplete
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Checkout Was Cancelled
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Your payment was cancelled and no amount was charged. You can try again whenever you are ready.
          </p>
        </div>

        {/* Helpful Info Box */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2 font-bold text-gray-800">
            <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>What happens next?</span>
          </div>
          <p className="leading-relaxed text-gray-500">
            • Your items are still in your cart — you can complete your purchase using Online Payment or Cash on Delivery.
          </p>
          <p className="leading-relaxed text-gray-500">
            • The unpaid order has been cancelled automatically, so the store won't receive it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            to="/cart"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Return to Cart & Retry</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to="/stores"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-gray-500" />
              <span>Browse Stores</span>
            </Link>

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

