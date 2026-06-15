import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/context";
import { v4 as uuid } from "uuid";
import { db } from "../../db";
import { toast } from "react-toastify";
import { defaultPP } from "../../assets/assets";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddProduct() {
  const [productImg, setProductImg] = useState(null);

  const { currentUser, setUserData, setCurrentUser } = useContext(UserContext);

  const navigate = useNavigate();
  const initialFormData = {
    product_name: "",
    product_url: "",
    product_weight: "",
    product_weight_type: "none",
    product_price: "",
    product_offer_price: "",
    product_description: "",
    isProductInStock: true,
    isOfferAvailable: false,
    store_id: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // ================= HANDLE IMAGE =================
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please upload image only");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      const imgUrl = fileReader.result;

      setProductImg(imgUrl);

      setFormData((prev) => ({
        ...prev,
        product_url: imgUrl,
      }));
    };

    fileReader.readAsDataURL(selectedFile);
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "product_price" ||
        name === "product_offer_price" ||
        name === "product_weight"
          ? value.replace(",", ".")
          : value,
    }));
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setFormData(initialFormData);
    setProductImg(null);
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================= VALIDATIONS =================
    if (!productImg) {
      toast.error("Enter product image");
      return;
    }

    if (Number(formData.product_price) <= 0) {
      toast.error("Invalid product price");
      return;
    }

    if (Number(formData.product_offer_price) > Number(formData.product_price)) {
      toast.error("Offer price cannot exceed product price");
      return;
    }

    try {

      // ================= PRODUCT DATA =================
      const productData = {
        ...formData,

        // product_id: uuid(),

        store_id: currentUser._id,

        product_name: formData.product_name.trim(),

        product_description: formData.product_description.trim(),

        product_price: Number(formData.product_price),

        product_offer_price: Number(formData.product_offer_price),

        product_weight: Number(formData.product_weight),

        isOfferAvailable: false,
      };

      // ================= UPDATE DATABASE =================
      const payload = productData;
      axios
        .post("http://localhost:5000/product/add-product", payload)
        .then((res) => {
          console.log(res.data || "nothing")
          toast.success("Product Added");
        });

      // ================= UPDATE CONTEXT =================
      // setCurrentUser();

      // setUserData();


      // ================= RESET FORM =================
      // resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-w-[300px] max-w-[500px]">
      <form
        onSubmit={handleSubmit}
        className="font-semibold text-sm w-full p-3 rounded-md space-y-3 border border-gray-300"
      >
        <div>
          <button
            type="button"
            onClick={() => navigate("/product-list")}
            className="flex items-center gap-1 text-gray-700 hover:text-green-800 font-semibold duration-100"
          >
            <ArrowLeftIcon size={18} strokeWidth={2.5} />
            <span className="text-sm">Back to Orders</span>
          </button>
        </div>
        <p>Please add products related to the: {currentUser.store_type}</p>

        {/* ================= PRODUCT IMAGE ================= */}
        <div>
          <p>Product Image</p>

          <div className="w-max relative group">
            <div className="text-sm text-gray-500 overflow-hidden">
              <div className="border border-dashed active:scale-95 border-gray-400 h-20 w-24 flex flex-col items-center justify-center bg-gray-200 relative overflow-hidden">
                {productImg === null ? (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    {/* UPLOAD SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="27px"
                      viewBox="0 -960 960 960"
                      width="27px"
                      fill="#666666"
                    >
                      <path d="M260-180q-82.92 0-141.46-57.53Q60-295.06 60-378.15q0-74.54 47.96-131.12t118.96-67.04Q246.15-666 317.12-723q70.96-57 162.88-57 108.64 0 184.32 75.68Q740-628.64 740-520v20h12.31q63.23 4.92 105.46 50.85Q900-403.23 900-340q0 66.92-46.15 113.46Q807.69-180 740.77-180H522.31Q492-180 471-201q-21-21-21-51.31v-219.08l-74 72.77-42.15-41.76L480-586.54l146.15 146.16L584-398.62l-74-72.77v219.08q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85H740q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20.77q-56.85 0-98.04 41Q120-438 120-380t41 99q41 41 99 41h100v60H260Zm220-270Z" />
                    </svg>

                    <span>upload</span>

                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <>
                    <img
                      src={productImg || defaultPP}
                      alt="product image"
                      className="w-full h-full object-contain z-[50]"
                    />

                    {/* DELETE IMAGE */}
                    <div className="absolute z-[60] top-0 right-0">
                      <button
                        type="button"
                        className="outline-none"
                        onClick={() => {
                          setProductImg(null);

                          setFormData((prev) => ({
                            ...prev,
                            product_url: "",
                          }));
                        }}
                      >
                        {/* DELETE SVG */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="22px"
                          viewBox="0 -960 960 960"
                          width="22px"
                          fill="#EA3323"
                        >
                          <path d="M304.62-160q-26.85 0-45.74-18.88Q240-197.77 240-224.62V-720h-40v-40h160v-30.77h240V-760h160v40h-40v495.38q0 27.62-18.5 46.12Q683-160 655.38-160H304.62ZM680-720H280v495.38q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92h350.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93V-720ZM392.31-280h40v-360h-40v360Zm135.38 0h40v-360h-40v360ZM280-720v520-520Z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT NAME ================= */}
        <div>
          <p>Product Name</p>

          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            placeholder="Type here..."
            className="bg-transparent h-8 w-full outline-none border border-gray-600 rounded-md py-1 px-2"
          />
        </div>

        {/* ================= PRODUCT WEIGHT ================= */}
        <div className="flex items-center gap-5">
          <div className="w-full">
            <p>Product Weight</p>

            <input
              type="text"
              inputMode="decimal"
              name="product_weight"
              value={formData.product_weight}
              onChange={handleChange}
              required
              placeholder="Type here..."
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
            />
          </div>

          <div className="w-full">
            <p>Weight Type</p>

            <select
              name="product_weight_type"
              value={formData.product_weight_type}
              onChange={handleChange}
              className="bg-transparent outline-none border border-gray-400 rounded-md py-1 px-2 w-full"
            >
              <option value="none">Select Weight Type</option>

              <option value="g">Gm</option>

              <option value="kg">Kg</option>

              <option value="ml">Ml</option>

              <option value="ltr">Ltr</option>

              <option value="none">N/A</option>
            </select>
          </div>
        </div>

        {/* ================= PRODUCT PRICE ================= */}
        <div className="flex items-center gap-3">
          <div className="w-full">
            <p>Product Price ($)</p>

            <input
              type="number"
              name="product_price"
              value={formData.product_price}
              onChange={handleChange}
              required
              placeholder="0"
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
            />
          </div>

          <div className="w-full">
            <p>Offer Price ($)</p>

            <input
              type="number"
              name="product_offer_price"
              value={formData.product_offer_price}
              onChange={handleChange}
              placeholder="0"
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
            />
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        <div>
          <p>Product Description</p>

          <textarea
            rows={3}
            name="product_description"
            value={formData.product_description}
            onChange={handleChange}
            required
            placeholder="Type here..."
            className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2"
          />
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="active:scale-95 px-5 w-[60%] m-auto py-1 bg-green-600 rounded-md hover:shadow-lg"
          >
            Add Product
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="active:scale-95 px-5 w-[60%] m-auto py-1 text-white bg-red-600 rounded-md hover:shadow-lg"
          >
            Reset Data
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
