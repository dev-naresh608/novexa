import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../db";
import { UserContext } from "../../../contexts/context";
import {
  ArrowLeftIcon,
  CreditCard,
  Mail,
  Phone,
  User,
  Smartphone,
  Banknote,
  MapPin,
  Store,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { orderStatusConfig } from "../index";

import { OrderItemList } from "./OrderItemListPage";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/order/detail/${orderId}`,
        );
        if (!data.success) {
          return toast.error(data.message);
        }
        const { order, products: order_items } = data.result;
        setOrder(order);
        setOrderItems(order_items);
      } catch (error) {
        return toast.error(error.message);
      }
    };
    fetchOrder();
  }, []);

  console.log(orderItems);

  // ================== COMMONG BOX CSS ====================
  const commonSectionCss = "";

  // ================== STATUS CONFIG ====================
  const STATUS_CONFIG = orderStatusConfig();
  const cfg = STATUS_CONFIG[order?.order_status];

  // ================== SUB-COMPONENT ====================
  function SectionCard({ children, className = "" }) {
    return (
      <div
        className={`bg-white border border-gray-100 rounded-xl p-4 shadow-sm ${className}`}
      >
        {children}
      </div>
    );
  }

  function SectionLabel({ children }) {
    return (
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
        {children}
      </p>
    );
  }

  // ================== CUSTOMER INFO COMPONENT ====================
  const CustomerInfoComponent = () => {
    if (order) {
      const { customer_name, customer_phone, customer_email, payment_method } =
        order;

      const TITLE_CONFIG = [
        {
          icon: User,
          text: "Name",
          value: customer_name,
        },
        {
          icon: Phone,
          text: "phone",
          value: customer_phone,
        },
        {
          icon: Mail,
          text: "email",
          value: customer_email,
        },
        {
          icon: CreditCard,
          text: "Payment",
          value: payment_method,
        },
      ];
      return (
        <SectionCard>
          {" "}
          {<SectionLabel>Customer</SectionLabel>}
          <div className="[&>*:not(:last-child)]:border-b">
            {TITLE_CONFIG.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  className="flex justify-between items-center text-xs space-y-2 pb-2"
                >
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>
                      <Icon size={16} strokeWidth={2} />
                    </span>
                    <span>{t.text}</span>
                  </div>
                  <div className="font-semibold">
                    {t.text === "Payment" ? (
                      <div className="*:flex *:items-center *:gap-1 *:rounded-xl *:px-1.5 *:py-0.5 *:text-[11px]">
                        {t.value === "cashOnDelivery" ? (
                          <span className=" bg-green-200 text-green-900/90">
                            <Banknote size={13} strokeWidth={2} /> Cash
                          </span>
                        ) : (
                          <span className="bg-blue-100 text-blue-500/90">
                            <Banknote size={14} strokeWidth={2} />
                            Onine
                          </span>
                        )}
                      </div>
                    ) : (
                      <span>{t.value}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      );
    }
  };

  // ================== ORDER PRICE COMPONENT ====================
  const OrderPriceComponent = () => {
    if (order) {
      const { price, finalPrice, taxPrice, shippingPrice } =
        order?.price_detail;

      return (
        <SectionCard>
          {" "}
          <SectionLabel>PRICE BREAKDOWN</SectionLabel>
          <div>
            <div className="*:flex *:justify-between *:items-center [&_p>span:first-child]:text-gray-500 pb-3 pt-2 space-y-1.5 border-b border-r-gray-500">
              <p>
                <span>Subtotal</span>
                <span>${price.toFixed(2)}</span>
              </p>
              <p>
                <span>Shipping</span>
                {shippingPrice ? (
                  <span>{shippingPrice}</span>
                ) : (
                  <span className="text-green-600">FREE</span>
                )}
              </p>
              <p>
                <span>Tax</span>${taxPrice.toFixed(2)}
              </p>
            </div>
            <div className="*:flex *:justify-between *:items-center *:font-bold pt-2">
              <p>
                <span>Total</span>${finalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </SectionCard>
      );
    }
  };

  // ================== ADDRESS COMPONENT ====================
  const AddressComponent = () => {
    if (order) {
      const { order_address, store_address } = order;
      const CONFIG = [
        {
          icon: MapPin,
          text: "Delivery address",
          value: order_address,
          iconStyle: "text-blue-400",
        },

        {
          icon: Store,
          text: "Store address",
          value: store_address,
          iconStyle: "text-gray-500",
        },
      ];

      return (
        <SectionCard>
          {" "}
          <SectionLabel>ADDRESS</SectionLabel>
          <div>
            {CONFIG.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="flex gap-2 py-2 text-sm">
                  <div className="py-1">
                    <Icon size={14} className={c.iconStyle} />
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400">{c.text}</span>
                    <p className="text-gray-600">{c.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      );
    }
  };

  return (
    <>
      <div>
        <OrderPriceComponent />
        <CustomerInfoComponent />
        <AddressComponent />

        <div>
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-1 text-gray-700 hover:text-green-800 font-semibold duration-100"
          >
            <ArrowLeftIcon size={18} strokeWidth={2.5} />
            <span className="text-sm">Back to Orders</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
