export const searchOrdersSvc = (orders, searchValue) => {
  if (!searchValue.trim()) {
    return orders;
  }

  const search = searchValue.toLowerCase();

  return orders.filter((o) => {
    return (
      o._id?.toLowerCase().includes(search) ||
      o.store_name?.toLowerCase().includes(search) ||
      o.name?.toLowerCase().includes(search) ||
      o.store_address?.toLowerCase().includes(search) ||
      o.order_address?.toLowerCase().includes(search) ||
      o.order_status?.toLowerCase().includes(search) ||
      o.payment_method?.toLowerCase().includes(search)
    );
  });
};
