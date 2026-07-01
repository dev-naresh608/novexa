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
import {
  orderStatusConfig,
  SectionCard,
  SectionLabel,
  OrderHeaderDetail,
  CustomerInfo,
  Address,
  PriceBreakdown,
  OrderItemsComponent,
  OrderIdInfo,
} from "../index";
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

  // ======================== MAIN COMPONENT =========================
  const MainOrderComponent = () => {
    return (
      <>
        <div>
          {/* ============= BACK TO ORDERS BUTTON ============== */}
          <div className="pb-2">
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1 text-green-700 hover:text-green-800 font-semibold duration-100"
            >
              <ArrowLeftIcon size={18} strokeWidth={2.5} />
              <span className="text-sm">Back to Orders</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="md:col-span-12">
              {/* ============= ORDER - HEADER ============== */}
              <OrderHeaderDetail
                orderId={orderId}
                createdAt={order?.createdAt}
                cfg={cfg}
              />
            </div>

            <div className="md:col-span-4">
              {/* ================== CUSTOMER INFO COMPONENT ==================== */}
              <CustomerInfo order={order} />
            </div>
            <div className="md:col-span-4">
              {/* ================== ADDRESS COMPONENT ==================== */}
              <Address
                order_address={order?.order_address}
                store_address={order?.store_address}
                store_name={order?.store_name}
              />
            </div>
            <div className="md:col-span-4">
              {/* ================== ORDER PRICE BREAKlDOWN COMPONENT ==================== */}
              <PriceBreakdown price_detail={order?.price_detail} />
            </div>
            <div className="md:col-span-8">
              {/* ================== ORDER ITEMS COMPONENT==================== */}
              <OrderItemsComponent order={order} orderItems={orderItems} />
            </div>
            <div className="md:col-span-4 ">
              {/* ================== ORDER ID'S COMPONENT ==================== */}
              <OrderIdInfo order={order} />
            </div>
          </div>
        </div>
      </>
    );
  };
  return <MainOrderComponent />;
}

export default OrderDetail;
