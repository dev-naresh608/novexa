import api from "../../../configs/api";

/**
 * Fetch details of a specific store.
 */
export const getStoreApi = async (storeId) => {
  const { data } = await api.get(`/stores/${storeId}`);
  return data;
};

/**
 * Creates/places a new order in the database.
 */
export const addOrderApi = async (payload) => {
  const { data } = await api.post(`/order`, payload);
  return data;
};

/**
 * Fetch the user's persistent cart from the database.
 */
export const getCartApi = async (userId) => {
  const { data } = await api.get(`/cart/user/${userId}`);
  return data;
};

/**
 * Persist an added product in the user's cart.
 */
export const addToCartApi = async (userId, productId, storeId, quantity = 1) => {
  const { data } = await api.post(`/cart/add`, { userId, productId, storeId, quantity });
  return data;
};

/**
 * Update the quantity of a cart product in the database.
 */
export const updateCartQtyApi = async (userId, productId, quantity) => {
  const { data } = await api.patch(`/cart/update`, { userId, productId, quantity });
  return data;
};

/**
 * Remove an item from the user's cart in the database.
 */
export const removeFromCartApi = async (userId, productId) => {
  const { data } = await api.delete(`/cart/remove/${userId}/${productId}`);
  return data;
};

/**
 * Clear the entire cart from the database.
 */
export const clearCartApi = async (userId) => {
  const { data } = await api.delete(`/cart/clear/${userId}`);
  return data;
};
