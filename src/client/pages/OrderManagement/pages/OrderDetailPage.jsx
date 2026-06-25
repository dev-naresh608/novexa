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
  StoreIcon,
  CopyIcon,
} from "lucide-react";

import axios from "axios";
import { toast } from "react-toastify";
import { orderStatusConfig, SectionCard, SectionLabel } from "../index";
import dateAndTimeFormat from "../../../services/dateAndTimeFormat.service";

import { div } from "framer-motion/client";
import { stringify } from "uuid";

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
        // const { order, products: order_items } = data.result;
        setOrder(data.result);
        setOrderItems(data.result.order_items);
      } catch (error) {
        return toast.error(error.message);
      }
    };
    fetchOrder();
  }, []);

  // ================== STATUS CONFIG ====================
  const STATUS_CONFIG = orderStatusConfig();
  const cfg = STATUS_CONFIG[order?.order_status];

  // ================== ORDER DETAIL HEADER COMPONENT ===================
  const OrderDetailHeaderSection = () => {
    return (
      <SectionCard>
        <div className="flex justify-between">
          <div className="font-semibold text-gray-600 tracking-tight">
            <p>Order #{orderId.slice(0, 6).toLowerCase()}</p>
            <p className="text-gray-400 text-xs">
              {order?.createdAt && <p>{dateAndTimeFormat(order.createdAt)}</p>}
            </p>
          </div>
          <div
            className={`rounded-2xl py-1 px-2.5 text-sm flex h-max w-max items-center gap-2 font-semibold ${cfg?.pillStyle}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full block bg-yellow-600`}
            ></span>{" "}
            <span> {cfg?.label}</span>
          </div>
        </div>
      </SectionCard>
    );
  };

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
  const PriceBreakdown = () => {
    if (order) {
      const { price, finalPrice, taxPrice, shippingPrice } =
        order?.price_detail;

      return (
        <SectionCard>
          <div>
            <SectionLabel>PRICE BREAKDOWN</SectionLabel>
            <div className="*:flex *:justify-between *:items-center [&_p>span:first-child]:text-gray-500 [&_p>span:last-child]:font-semibold [&_p>span:last-child]:text-[14px] pb-3 pt-2 space-y-1.5 border-b border-r-gray-500 text-sm">
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
                <span>
                  Tax <span className="text-[10px]">(2%)</span>
                </span>
                <span>${taxPrice.toFixed(2)}</span>
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
          <div className="flex items-center justify-between">
            <SectionLabel>ADDRESS</SectionLabel>
            <SectionLabel className="flex items-center gap-2">
              <StoreIcon size={15} />
              {order?.store_name}
            </SectionLabel>
          </div>
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
                    <p className="text-gray-600 text-xs">{c.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      );
    }
  };

  // ================== ORDER ITEMS/PRODUCTS COMPONENT ====================
  const OrderItemsComponent = () => {
    if (order) {
      const ProductImage = ({ url }) => {
        return (
          <div className="group h-14 w-14 flex items-center justify-center rounded-2xl border bg-gray-100">
            <img
              className="group-hover:scale-105 duration-150 w-10 h-10 object-contain"
              src={url}
              alt="order item"
            />
          </div>
        );
      };

      return (
        <SectionCard className="p-5">
          <div className="flex items-center text-sm gap-2 pb-2">
            <SectionLabel>Items</SectionLabel>
            <SectionLabel className="bg-gray-100 rounded-2xl text-gray-500 px-2">
              {orderItems.length} items
            </SectionLabel>
          </div>

          <div
            className="space-y-3 gap-3 max-h-48 overflow-x-hidden overflow-y-auto 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-400
  [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {orderItems.map((product, index) => {
              const total = product.product_qty * product.product_price;

              return (
                <div
                  key={product._id}
                  className="hover:bg-gray-100/80 cursor-pointer border bg-gray-100/40 rounded-2xl p-2 flex items-center gap-2"
                >
                  <ProductImage url={product.product_url} />
                  <div className="text-xs">
                    <h3 className="font-semibold capitalize">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-500">
                      Weight:{" "}
                      {product.product_weight_type === "none"
                        ? product.product_weight
                        : `${product.product_weight}${product.product_weight_type}`}
                    </p>
                    <div>
                      <span className="font-semibold text-gray-500">
                        ${product.product_price} x {product.product_qty} = $
                        {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      );
    }
  };

  // ================== ORDER ID'S COMPONENT ====================
  const OrderInfo = () => {
    if (order) {
      const {
        _id: orderId,
        customer_id: customerId,
        store_id: storeId,
      } = order;

      const handleCopyId = (value) => {
        window.navigator.clipboard
          .writeText(value)
          .then(async (result) => toast.success("id copied"))
          .catch((err) => {
            return toast.error(err.message);
          });
      };

      const InfoRow = ({ label, value }) => {
        return (
          <div>
            <p className="font-semibold">{label}</p>
            <p className="text-xs flex items-center gap-2">
              <span>{value}</span>
              <button onClick={() => handleCopyId(value)}>
                <CopyIcon size={12} />
              </button>
            </p>
          </div>
        );
      };
      return (
        <SectionCard>
          <SectionLabel>order info</SectionLabel>
          <div className="text-sm text-gray-600 space-y-2">
            <InfoRow label="Order ID" value={orderId} />
            <InfoRow label="Customer ID" value={customerId} />
            <InfoRow label="Store ID" value={storeId} />
          </div>
        </SectionCard>
      );
    }
  };
  return (
    <>
      <div>
        <div className="pb-2">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-1 text-gray-700 hover:text-green-800 font-semibold duration-100"
          >
            <ArrowLeftIcon size={18} strokeWidth={2.5} />
            <span className="text-sm">Back to Orders</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="md:col-span-12">
            <OrderDetailHeaderSection />
          </div>

          <div className="md:col-span-4">
            <CustomerInfoComponent />
          </div>
          <div className="md:col-span-4">
            <AddressComponent />
          </div>
          <div className="md:col-span-4">
            <PriceBreakdown />
          </div>
          <div className="md:col-span-8">
            <OrderItemsComponent />
          </div>
          <div className="md:col-span-4 ">
            <OrderInfo />
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
