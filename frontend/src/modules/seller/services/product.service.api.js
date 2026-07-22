import axios from "axios";

export const getAllProductsApi = async (userId) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/product/allproducts/${userId}`,
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// ================ HANDLE STOCK CHANGE ==================
export const handleProductStockChangeApi = async (
  product_id,
  is_product_in_stock,
  userId,
) => {
  const updates = {
    is_product_in_stock: !is_product_in_stock,
  };
  const { data } = await axios.patch(
    `http://localhost:5000/product/${product_id}`,
    {
      store_id: userId,
      product_id,
      updates,
    },
  );
};

// ================ HANDLE OFFER CHANGE ==================
export const handleProductOfferChangeApi = async (
  product_id,
  is_offer_available,
  userId,
) => {
  const updates = {
    is_offer_available: !is_offer_available,
  };
  const { data } = await axios.patch(
    `http://localhost:5000/product/${product_id}`,
    {
      store_id: userId,
      updates,
    },
  );
};

// ================= DELETE PRODUCT =======================
export const handleDeleteProductApi = async (
  product_id,
  currentUser,
  setCurrentUser,
) => {
  const { data } = await axios.delete(
    `http://localhost:5000/product/${product_id}`,
    { data: { store_id: currentUser._id } },
  );

  const newUpdatedProductList = currentUser?.productList.filter(
    (p) => p._id !== data.result,
  );
  setCurrentUser((prev) => ({
    ...prev,
    productList: newUpdatedProductList,
  }));
};

export const getProductByIdApi = async (productId) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/product/${productId}`,
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductApi = async (productId, storeId, updates) => {
  try {
    const { data } = await axios.patch(
      `http://localhost:5000/product/${productId}`,
      {
        store_id: storeId,
        updates,
      },
    );
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
