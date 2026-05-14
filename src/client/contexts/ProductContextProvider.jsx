import React, { useEffect, useState, useMemo } from "react";
import { ProductContext } from "./context";
import { v4 as uuid } from "uuid";

import {
  fruitImgUrl,
  coldDrinkUrl,
  milkUrl,
  waferUrl,
  iceCreamUrl,
} from "../components/index";

import {
  Banana,
  Apple,
  Chiku,
  CocaCola,
  Fanta,
  Grape,
  IceCream,
  Milk,
  ButterMilk,
  RedBull,
  Sprite,
  Lays,
  MasalaMasti,
  AmulCone,
  ChocolateCone,
  AlooSev,
} from "../components/index";
import { db } from "../db";

function ProductContextProvider({ children }) {
  const [productsList, setProductsList] = useState([]);

  useMemo(() => {
    let localUserData = null;
    const getData = async () => {
      localUserData = await db.localUserData.toArray();
      const products = localUserData
      .filter(
        (user) =>
        user.role === "seller" && user.hasOwnProperty("productList")
      )
      .map((user) => user.productList)
      .flat()
      setProductsList(products);
    };
    getData();
  }, []);
  return (
    <ProductContext.Provider value={{ productsList }}>
      {children}
    </ProductContext.Provider>
  );
}

export default ProductContextProvider;
