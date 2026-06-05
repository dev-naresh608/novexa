import React, { useEffect, useState, useMemo } from "react";
import { ProductContext } from "./context";
import { v4 as uuid } from "uuid";

import {
  category_fruit,
  category_cold_drinks,
  category_milk,
  category_wafer,
  category_ice_cream

} from "../assets/assets";

import { db } from "../db";

function ProductContextProvider({ children }) {
  const [productsList, setProductsList] = useState([]);
  const [storeLisst, setStoreList] = useState([]);

  useEffect(() => {
    let localUserData = null;
    const getData = async () => {
      localUserData = await db.localUserData.toArray();
      const products = localUserData.filter(
        (user) => user.role === "seller" && user.hasOwnProperty("productList")
      ).map((p) => p.productList).flat()

      
      setProductsList(products);
      
      const stores = localUserData.filter((r) => r.role === "seller");
      setStoreList(stores);
    };
    getData();
  }, []);
  return (
    <ProductContext.Provider value={{ productsList, storeLisst }}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductContextProvider;
