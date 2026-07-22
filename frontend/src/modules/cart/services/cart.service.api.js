import axios from "axios";
export const getStoreApi = async (storeId) => {
  const { data } = await axios.get(`http://localhost:5000/stores/${storeId}`);
  return data;
};

export const addOrderApi = async (payload) => {
  const { data } = await axios.post(`http://localhost:5000/order`, payload);
  return data;
}