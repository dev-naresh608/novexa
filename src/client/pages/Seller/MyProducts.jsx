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
  
  if (currentUser?.productList?.length === 0 || !currentUser.hasOwnProperty('productList')) {
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
      <h2 className="text-2xl font-semibold text-gray-600">Your Products...</h2>
      <div className="md:max-w-[800px] rounded-2xl border border-black/20">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] text-gray-500 font-semibold p-2 sm:text-md md:text-xl border-b border-black/20">
          <span>Product</span>
          <span>Category</span>
          <span>Selling Price</span>
          <span>In Stock</span>
        </div>
        {currentUser.productList.map((product, i) => (
          <div
            key={i}
            className="grid items-center grid-cols-[2fr_1fr_1fr_1fr] p-2 my-2  sm:text-md md:text-xl"
          >
            <div className="flex gap-5 items-center">
              <div className="h-20 w-20 p-2 border border-black/20">
                <img
                  className="w-full h-full"
                  src={product.product_url}
                  alt={product.product_name}
                />
              </div>
              <div>
                <span className="font-semibold capitalize">
                  {product.product_name}{" "}
                </span>
                <span className="text-gray-500">
                  {product.product_weight}
                  {product.product_weight_type === "none" ? (
                    <span className="text-xs"> N/A</span>
                  ) : (
                    <span className="text-xs">
                      {product.product_weight_type}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div>
              <span>{product.product_category}</span>
            </div>
            <div className="ml-5">
              <span>{product.product_price}$</span>
            </div>
            <div className="ml-5">
              <input
                type="checkbox"
                className="h-4 w-4 accent-red-600"
                onChange={() => handleProductStockChange(product.product_id)}
                checked={product.isProductInStock}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyProducts;
