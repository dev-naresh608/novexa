import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/context";
import { data, useNavigate } from "react-router-dom";
import { db } from "../../db/index";
import { DeleteIcon, Trash2Icon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

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

  const [isProductsAvail, setIsProductsAvail] = useState(false);
  // ===================== BACKEND =========================
  useEffect(() => {
    const fetchAllProducts = async (params) => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/product/allproducts",
          { params },
        );
        if (data.success) {
          setIsProductsAvail(true);
          currentUser.productList = data.result;
          setCurrentUser(currentUser);
          return;
        }
        setIsProductsAvail(false);
        // console.log(currentUser.productList)
      } catch (error) {
        setIsProductsAvail(false);
        toast.error(error);
      }
    };
    const params = {
      store_id: currentUser._id,
    };
    fetchAllProducts(params);
  }, [currentUser]);

  if (!isProductsAvail) {
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

  // ================ HANDLE STOCK CHANGE ==================
  const handleProductStockChange = async (product_id, is_product_in_stock) => {
    const updates = {
      is_product_in_stock: !is_product_in_stock,
    };
    const { data } = await axios.patch(
      `http://localhost:5000/product/${product_id}`,
      {
        store_id: currentUser._id,
        product_id,
        updates,
      },
    );
    console.log(currentUser);
  };

  // ================ HANDLE OFFER CHANGE ==================
  const handleProductOfferChange = async (product_id, is_offer_available) => {
    const updates = {
      is_offer_available: !is_offer_available,
    };
    const { data } = await axios.patch(
      `http://localhost:5000/product/${product_id}`,
      {
        store_id: currentUser._id,
        updates,
      },
    );
  };

  // ================= DELETE PRODUCT =======================
  const handleDeleteProduct = async (product_id) => {
    const { data } = await axios.delete(
      `http://localhost:5000/product/${product_id}`,
      { data: { store_id: currentUser._id } },
    );

    const newUpdatedProductList = currentUser.productList.filter(
      (p) => p._id !== data.result,
    );
    setCurrentUser((prev) => ({
      ...prev,
      productList: newUpdatedProductList,
    }));
  };

  return (
    <>
      <h2 className="text-2xl pb-2 font-semibold text-gray-600">
        Your Products...
      </h2>
      <div className="md:max-w-[900px] rounded-2xl font-semibold border border-black/20">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] text-gray-500 p-2 sm:text-md md:text-xl border-b border-black/20">
          <span>Product</span>
          <span>Selling Price</span>
          <span>In Stock</span>
          <span>Offer</span>
          <span>Action</span>
        </div>
        {currentUser?.productList?.map((product, i) => (
          <div
            key={i}
            className="grid items-center grid-cols-[2fr_1fr_1fr_1fr_1fr] p-2 my-2  sm:text-md md:text-xl"
          >
            {/* ============ PRODUCT IMAGE AND DETAILS =========== */}
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
                <p className="text-sm text-gray-500">
                  Weight: {product.product_weight}
                  <span className="text-[10px]">
                    {product.product_weight_type === "none"
                      ? "N/A"
                      : product.product_weight_type}
                  </span>
                </p>
              </div>
            </div>

            {/* ============ PRODUCT PRICING =========== */}
            <div className="ml-5">
              <span>{product.product_price}$</span>
            </div>

            {/* ============ PRODUCT STOCK STATE=========== */}
            <div className="ml-5">
              <label
                onChange={() =>
                  handleProductStockChange(
                    product._id,
                    product.is_product_in_stock,
                  )
                }
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  defaultChecked={product.is_product_in_stock}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* ============ PRODUCT OFFER =========== */}
            <div className="ml-5">
              <label
                onChange={() =>
                  handleProductOfferChange(
                    product._id,
                    product.is_offer_available,
                  )
                }
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  defaultChecked={product.is_offer_available}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="ml-5">
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="w-max h-max"
              >
                <Trash2Icon className="text-red-600 hover:scale-105 duration-150 cursor-pointer" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyProducts;
