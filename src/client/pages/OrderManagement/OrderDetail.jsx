import React, { useContext, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { db } from "../../db";
import { UserContext } from "../../contexts/context";
import { ArrowLeftIcon } from "lucide-react";

function OrderDetail() {
  const {orderId} = useParams();
  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const user = await db.localUserData.get(currentUser.id);
      const found = user?.myOrders?.find((o) => o.orderId === orderId);
      setOrder(found || null);
    };
    fetchOrder();
  }, []);


    // ================== STATUS CONFIG ====================
  const STATUS_CONFIG = {
    pending: {
      label: "Pending",
      pillStyle: "bg-yellow-100 text-yellow-700 border-yellow-500",
    },
    preparing: {
      label: "preparing",
      pillStyle: "bg-green-100 text-green-700 border-green-500",
    },
    completed: {
      label: "Completed",
      pillStyle: "bg-emerald-100 text-emerald-700 border-emerald-500",
    },
    rejected: {
      label: "Rejected",
      pillStyle: "bg-red-100 text-red-700 border-red-500",
    },
  };
  const cfg = STATUS_CONFIG[order?.orderStatus];

  return (
    <>
      <div>
        <div>
          <button onClick={() => navigate('/orders')} className="flex items-center gap-1 text-gray-700 hover:text-green-800 font-semibold duration-100">
            <ArrowLeftIcon size={18} strokeWidth={2.5}/>
            <span className="text-sm">Back to Orders</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
