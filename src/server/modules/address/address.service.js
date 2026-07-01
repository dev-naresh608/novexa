const Address = require("./address.model");
const findAddressSvc = async (userId) => {
  const addressList = await Address.find({ user_id: userId });
  return addressList;
};

const addAddressSvc = async (userId, payload) => {
  const { name, phone, street, city, state, pincode } = payload;

  const address = await Address.create({
    user_id: userId,
    name: name,
    phone: phone,
    street: street,
    city: city,
    state: state,
    pincode: pincode,
  });

  return address;
};

module.exports = {
  findAddressSvc,
  addAddressSvc,
};
