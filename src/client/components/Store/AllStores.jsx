import React, { useContext, useEffect, useState } from "react";
import { defaultRest } from "../../assets/assets";
import {UserContext} from "../../contexts/context"
import {Store} from "../component"
import { db } from "../../db";


function AllStores() {
  const [AllStores, setAllStores] = useState([]);
  const {currentUser,userData} = useContext(UserContext)
  useEffect(() => {
    const getStores = async () => {
      const allUsers = await db.localUserData.toArray();
      const AllStores =
        allUsers.filter((user) => user.role === "seller") || [];

      setAllStores(AllStores);
    };
    getStores();
  }, [currentUser,userData]);

  return (
    <>
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
        {AllStores.map((r, i) => {
          return (
            <Store
              key={i}
              defaultRest={defaultRest}
              name={r.store_name}
              address={r.store_address}
              productsLength={r.productList?.length || 0}
              id={r.id}
            />
          );
        })}
      </div>
    </>
  );
}

export default AllStores;
