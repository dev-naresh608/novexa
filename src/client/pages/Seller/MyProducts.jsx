import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/context";
import { useNavigate } from "react-router-dom";
import { db } from "../../db/index";

function MyProducts() {
  const navigate = useNavigate();
  const {
    cartItems,
    currentUser,
    setUserData,
    setCurrentUser,
    activeTab,
    setActiveTab,
  } = useContext(UserContext);

  if (
    currentUser?.productList?.length === 0 ||
    !currentUser.hasOwnProperty("productList")
  ) {
    return (
      <section className="flex flex-col items-center justify-center text-center py-16">
        <h2 className="text-lg font-semibold text-gray-600">Add Products</h2>
        <button
          onClick={() => navigate("/addproducts")}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Continue to Add Products
        </button>
      </section>
    );
  }

  const handleProductStockChange = async (product_id) => {
    let updatedProductList = currentUser.productList.map((p) =>
      p.product_id === product_id
        ? { ...p, isProductInStock: !p.isProductInStock }
        : p,
    );
    let updatedCurrentUser = {
      ...currentUser,
      productList: updatedProductList,
    };
    await db.localUserData.put(updatedCurrentUser);
    setCurrentUser(updatedCurrentUser);
  };

  return (
    <>
      <h2 className="text-2xl pb-2 font-semibold text-gray-600">
        Your Products...
      </h2>
      <div className="md:max-w-[650px] rounded-2xl font-semibold border border-black/20">
        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 p-2 sm:text-md md:text-xl border-b border-black/20">
          <span>Product</span>
          <span>Selling Price</span>
          <span>In Stock</span>
        </div>
        {currentUser.productList.map((product, i) => (
          <div
            key={i}
            className="grid items-center grid-cols-[2fr_1fr_1fr] p-2 my-2  sm:text-md md:text-xl"
          >
            <div className="flex gap-5 items-center">
              <div className="group hover:scale-105 duration-100 h-20 w-20 p-2 flex justify-center items-center bg-gray-200/50 border border-black/20 rounded-2xl">
                <img
                  className="h-14 w-14 group-hover:scale-105 duration-150"
                  src={product.product_url}
                  alt={product.product_name}
                />
              </div>
              <div>
                <p className="capitalize">{product.product_name}</p>
                <p className="text-xs text-gray-500">
                  Weight: {product.product_weight}{" "}
                  <span className="text-[10px]">
                    {product.product_weight_type === "none"
                      ? "N/A"
                      : product.product_weight_type}
                  </span>
                </p>
              </div>
            </div>

            <div className="ml-5">
              <span>{product.product_price}$</span>
            </div>
            <div className="ml-5">
              <label
                onChange={() => handleProductStockChange(product.product_id)}
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  defaultChecked={product.isProductInStock}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyProducts;
