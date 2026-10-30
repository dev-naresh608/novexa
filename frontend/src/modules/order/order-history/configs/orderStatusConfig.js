const orderStatusConfig = () => {
  return {
    pending: {
      label: "Pending",
      pillStyle: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    preparing: {
      label: "Preparing",
      pillStyle: "bg-amber-100 text-amber-800 border-amber-200",
    },
    confirmed: {
      label: "Confirmed",
      pillStyle: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    processing: {
      label: "Processing",
      pillStyle: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    ready: {
      label: "Ready for Pickup",
      pillStyle: "bg-teal-100 text-teal-800 border-teal-200",
    },
    shipped: {
      label: "Shipped",
      pillStyle: "bg-blue-100 text-blue-800 border-blue-200",
    },
    out_for_delivery: {
      label: "Out for Delivery",
      pillStyle: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
    completed: {
      label: "Completed",
      pillStyle: "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold",
    },
    delivered: {
      label: "Delivered",
      pillStyle: "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold",
    },
    rejected: {
      label: "Rejected",
      pillStyle: "bg-red-100 text-red-700 border-red-200",
    },
    cancelled: {
      label: "Cancelled",
      pillStyle: "bg-red-100 text-red-700 border-red-200",
    },
  };
};

export default orderStatusConfig;
