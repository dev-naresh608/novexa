import api from "../../../configs/api";
import { toast } from "react-toastify";

export const handleGetAddressApi = async (userId) => {
  if (!userId) return;
  try {
    const { data } = await api.get(
      `/address/all/${userId}`,
    );
    return data;
  } catch (error) {
    return toast.error(error.message);
  }
};

export const handleAddAddressApi = async (userId, payload) => {
  if (!userId || !payload) return;
  try {
    const { data } = await api.post(
      `/address/add/${userId}`,
      payload,
    );
    return data;
  } catch (error) {
    return toast.error(error.message);
  }
};
