import dateAndTimeFormat from "../../../services/dateAndTimeFormat.service";

// SEARCH
export const searchOrdersSvc = (allOrders, searchValue) => {
  if (!searchValue.trim()) {
    return allOrders;
  }

  const search = searchValue.toLowerCase().trim();

  return allOrders.filter((o) => {
    return (
      o._id?.toLowerCase().includes(search) ||
      o.store_name?.toLowerCase().includes(search) ||
      o.name?.toLowerCase().includes(search) ||
      o.store_address?.toLowerCase().includes(search) ||
      o.order_status?.toLowerCase().includes(search) ||
      o.payment_method?.toLowerCase().includes(search) ||
      o.price_detail?.finalPrice.includes(search) ||
      ("$" + o.price_detail?.finalPrice).includes(search)
      // || dateAndTimeFormat(o?.createdAt, "date").trim().includes(search)
    );
  });
};

// FILTER
export const filterOrderByStatus = (allOrders, status = "all") => {
  if (!allOrders || allOrders.length === 0 || status === "all") {
    return allOrders;
  }

  const filteredOrder = allOrders.filter((o) => o.order_status === status);
  if (!filteredOrder) {
    return allOrders;
  }

  return filteredOrder;
};
export const filterOrderByPayment = (allOrders, paymentMethod) => {
  if (!allOrders || allOrders.length === 0 || paymentMethod === "all") {
    return allOrders;
  }
};
export const filterTodaysOrders = (allOrders) => {
  if (!allOrders || allOrder.length === 0) return allOrders;
  const today = new Date().toDateString();
  return allOrders.filter((order) => new Date(order.createdAt).toDateString());
};

// SORT

export const sortOrderByDate = (
  allOrders,
  order = "desc",
  key = "createdAt",
) => {
  if (!allOrders || allOrders.length === 0) {
    return allOrders;
  }

  return allOrders.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};
export const sortOrderByPrice = (allOrders, order = "desc") => {
  if (!allOrders || allOrders.length === 0) {
    return allOrders;
  }

  return allOrders.sort((a, b) => {
    const priceA = a.price_detail.finalPrice;
    const priceB = b.price_detail.finalPrice;

    return order === "desc" ? priceB - priceA : priceA - priceB;
  });
};
