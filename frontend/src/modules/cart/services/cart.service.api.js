import api from "../../../configs/api";
export const getStoreApi = async (storeId) => {
  const { data } = await api.get(`/stores/${storeId}`);
  return data;
};

export const addOrderApi = async (payload) => {
  const { data } = await api.post(`/order`, payload);
  return data;
}