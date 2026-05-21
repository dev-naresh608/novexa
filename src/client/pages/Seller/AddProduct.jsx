import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/context";
import { v4 as uuid } from "uuid";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../../db";

function AddProduct() {
  const [productImg, setProductImg] = useState(null);
  const { currentUser, setUserData, setCurrentUser } = useContext(UserContext);

  const initialFormData = {
    product_name: "",
    product_url: "",
    // product_category: "other",
    product_weight: "",
    product_weight_type: "none",
    product_price: 0,
    // product_shiping_price: 0,
    product_offer_price: 0,
    product_description: "",
    isProductInStock: true,
    isOfferAvailable: false,
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload image only");
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
  const handleFormData = async (e) => {
    e.preventDefault();
    // console.log('Current User: ', currentUser)
    if (!productImg) {
      alert("Enter product Image");
      return;
    }

    const productData = {
      ...formData,
      product_id: uuid(),
    };

    const user = await db.localUserData.get(currentUser.id);

    await db.localUserData.update(currentUser.id, {
      productList: [...(user.productList || []), productData],
    });

    setCurrentUser(await db.localUserData.get(currentUser.id));
    setUserData(await db.localUserData.toArray());
    toast.success("Added");

    setFormData(initialFormData);
    setProductImg(null);
    e.target.reset();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <ToastContainer autoClose={500} pauseOnHover />
      <div className="min-w-[300px] max-w-[500px]">
        <form
          action=""
          className="font-semibold text-sm w-full p-3 rounded-md space-y-3 border border-gray-300"
          onSubmit={handleFormData}
          >
          <p>Please add products related to the: {currentUser.restorent_type}</p>
          <div>
            <p>Product Image</p>

            <div className="w-max relative group">
              <label className="text-sm text-gray-500 cursor-pointer overflow-hidden">
                <div className="border border-dashed border-gray-400 h-20 w-24 flex flex-col items-center justify-center bg-gray-200">
                  {productImg === null ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <img
                        src={productImg !== "" ? productImg : "defaultPP"}
                        alt="product image"
                        className="w-full h-full  object-contain"
                      />

                      {/* Edit image
                      <div className="absolute group-hover:block bg-gray-200 p-0.5 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18px"
                          viewBox="0 -960 960 960"
                          width="18px"
                          fill="blue"
                        >
                          <path d="M200-200h43.92l427.93-427.92-43.93-43.93L200-243.92V-200Zm-40 40v-100.77l527.23-527.77q6.15-5.48 13.57-8.47 7.43-2.99 15.49-2.99t15.62 2.54q7.55 2.54 13.94 9.15l42.69 42.93q6.61 6.38 9.04 14 2.42 7.63 2.42 15.25 0 8.13-2.74 15.56-2.74 7.42-8.72 13.57L260.77-160H160Zm600.77-556.31-44.46-44.46 44.46 44.46ZM649.5-649.5l-21.58-22.35 43.93 43.93-22.35-21.58Z" />
                        </svg>
                      </div> */}

                      {/* delete image */}
                      <div className="absolute top-0 right-0">
                        <button
                          className="outline-none"
                          onClick={() => {
                            setProductImg("");
                            setFormData((prev) => ({
                              ...prev,
                              product_url: "",
                            }));
                          }}
                        >
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
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <p>Product Name</p>
              <input
                type="text"
                name="product_name"
                onChange={handleChange}
                required
                className="bg-transparent h-8 w-full outline-none border border-gray-600 rounded-md py-1 px-2 text-md placeholder:text-xs"
                placeholder="Type Here"
              />
            </div>
            {/* <div>
              <p>Category</p>
              <select
                name="product_category"
                onChange={handleChange}
                value={formData.product_category}
                className="bg-transparent outline-none border border-gray-400 rounded-md py-1 px-2"
              >
                <option value="other">Select Category</option>
                <option value="Fruits">🍉 Fruits</option>
                <option value="Vegetables">🥕 Vegetables</option>
                <option value="Bakery">🍞 Bakery</option>
                <option value="Dairy">🫙Dairy Products</option>
                <option value="Namkeen">🍟 Chips & Namkeen</option>
                <option value="Drinks">🥤 Cold Drinks & Juices</option>
                <option value="Ice Creams & More">🍧 Ice Creams & More</option>
              </select>
            </div> */}
          </div>

          <div className="flex items-center gap-5">
            <div className="min-w-[30%] w-full">
              <p>Product Weight</p>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                name="product_weight"
                onChange={handleChange}
                required
                className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2 text-md  placeholder:text-xs [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Type here..."
              />
            </div>
            <div className="min-w-[30%] w-full">
              <p>Weight Type</p>
              <select
                className="bg-transparent outline-none border border-gray-400 rounded-md py-1 px-1"
                name="product_weight_type"
                onChange={handleChange}
                value={formData.product_weight_type}
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

          <div className="flex items-center gap-3">
            <div className="min-w-[30%] w-full">
              <p>
                Product Price <span className="text-sm text-black/60">($)</span>
              </p>
              <input
                type="number"
                name="product_price"
                onChange={handleChange}
                required
                className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2 text-md  placeholder:text-xs [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>
            <div className="min-w-[30%] w-full">
              <p>
                Offer Price <span className="text-sm text-black/60">($)</span>
              </p>
              <input
                type="number"
                name="product_offer_price"
                onChange={handleChange}
                // required
                className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2 text-md placeholder:text-xs [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
            </div>
            {/* <div className="min-w-[30%] w-full">
              <p>
                Shiping Price <span className="text-sm text-black/60">($)</span>
              </p>
              <input
                type="number"
                name="product_shiping_price"
                onChange={handleChange}
                // required
                className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2 text-md placeholder:text-xs [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
            </div> */}
          </div>

          <div>
            <p>Product Description</p>
            <textarea
              rows={3}
              name="product_description"
              onChange={handleChange}
              required
              className="bg-transparent w-full outline-none border border-gray-600 rounded-md py-1 px-2 text-md placeholder:text-xs"
              placeholder="Type Here..."
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 w-[60%] m-auto py-1 bg-green-600 rounded-md
              hover:shadow-lg"
            >
              Add Product
            </button>
            <button
              type="reset"
              className="px-5 w-[60%] m-auto py-1 text-white/90 bg-red-600 rounded-md hover:shadow-lg"
              onClick={() => {
                setProductImg(null);
                setFormData(initialFormData);
              }}
            >
              Reset Data
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddProduct;
