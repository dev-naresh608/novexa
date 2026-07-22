import api from "../../../configs/api";

export const acceptOrder = () => {};

export const rejectOrder = () => {};

export const completeOrder = () => {};

export const assignDriver = () => {};

export const updateOrderStatus = () => {};

export const getAllOrdersSvc = async (id, role) => {
  return await api.get(
    `/order/${id}?role=${role}`,
  );
};
