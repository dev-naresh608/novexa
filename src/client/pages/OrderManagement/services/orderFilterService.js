export const searchOrders = (orders, searchValue) => {
  if (!searchValue.trim()) {
    return orders;
  }

  const search = searchValue.toLowerCase();

  return orders.filter((o) => {
    return (
      o.orderId?.toLowerCase().includes(search) ||
      o.store_name?.toLowerCase().includes(search) ||
      o.name?.toLowerCase().includes(search) ||
      o.orderStatus?.toLowerCase().includes(search) ||
      o.paymentMethod?.toLowerCase().includes(search) ||
      // o.priceDetails?.finalPrice?.toLowerCase().includes(Number(search)) ||
      o.itmes?.filter((items) => {
        return (
          items.product_name?.toLowerCase().includes(search) ||
          items.paymentMethod?.toLowerCase().includes(search)
        );
      })
    );
  });
};
