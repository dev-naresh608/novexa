import axios from "axios";
import { toast } from "react-toastify";

export const handleGetAddressApi = async (userId) => {
  if (!userId) return;
  try {
    const { data } = await axios.get(
      `http://localhost:5000/address/all/${userId}`,
    );
    return data;
  } catch (error) {
    return toast.error(error.message);
  }
};

export const handleAddAddressApi = async (userId, payload) => {
  if (!userId || !payload) return;
  try {
    const { data } = await axios.post(
      `http://localhost:5000/address/add/${userId}`,
      payload,
    );
    return data;
  } catch (error) {
    return toast.error(error.message);
  }
};
