import axios from "axios";

export const acceptOrder = () => {};

export const rejectOrder = () => {};

export const completeOrder = () => {};

export const assignDriver = () => {};

export const updateOrderStatus = () => {};

export const getAllOrdersSvc = async (id, role) => {
  return await axios.get(
    `http://localhost:5000/order/${id}?role=${role}`,
  );
};
