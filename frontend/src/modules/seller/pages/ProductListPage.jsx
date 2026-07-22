import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../../contexts/context";
import { data, useNavigate } from "react-router-dom";
// import { db } from "../../db/index";
import { DeleteIcon, Trash2Icon } from "lucide-react";
import { toast } from "react-toastify";

import {
  EmptyProducts,
  ProductImage,
  getAllProductsApi,
  handleDeleteProductApi,
  handleProductOfferChangeApi,
  handleProductStockChangeApi,
  ProductTable,
  searchProductsSvc,
} from "../index";
import { SectionCard, SearchBar } from "../../../index";

function ProductListPage() {
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
  const [allProducts, setAllProducts] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      const data = await getAllProductsApi(currentUser._id);
      if (!data.success) {
        isProductsAvail(false);
        return toast.error(data.message);
      }
      setAllProducts(data.result);
      setCurrentUser((prev) => ({
        ...prev,
        productList: data.result,
      }));
      setIsProductsAvail(true);
      // console.log(currentUser.productList)
    };

    fetchAllProducts();
  }, []);
  const filteredProducts = useMemo(() => {
    return searchProductsSvc(allProducts, searchValue);
  }, [allProducts,searchValue]);

  if (!isProductsAvail) {
    return <EmptyProducts />;
  }

  return (
    <>
      {/* =========== FILTER HEADER============ */}
      <SearchBar
        placeholder="search products..."
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {/* ================= PRODUCT LIST TABLE ================= */}
      <SectionCard>
        <ProductTable allProducts={filteredProducts} />
      </SectionCard>
    </>
  );
}

export default ProductListPage;
