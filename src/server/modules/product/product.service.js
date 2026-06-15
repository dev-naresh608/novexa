const Seller = require("../seller/seller.model");
const Product = require("./product.model");
const User = require("../User");

const addProduct = async (payload) => {
  const {
    store_id,
    product_name,
    product_url,
    product_weight,
    product_weight_type,
    product_price,
    product_offer_price,
    product_description,
  } = payload;

  if (!store_id) {
    return { msg: "Store id missing" };
  }

  // const product = await Product.create({
  //   store_id: store_id,
  //   product_name: product_name,
  //   product_url: product_url,
  //   product_weight: product_weight,
  //   product_weight_type: product_weight_type,
  //   product_price: product_price,
  //   product_offer_price: product_offer_price,
  //   product_description: product_description,
  // });

  const data = await Seller.findById(store_id) || "nothing";
  const user = await User.findById(data.user_id);
  
  const res = await Seller.findOne().populate('user_id');           
  console.log(res)

  // const userData = {
  //   ...product.toObject(),
  //   ...user.toObject(),
  // };
};

module.exports = {
  addProduct,
};
