import React, { useEffect, useState } from "react";
import { defaultRest } from "../../assets/assets";
import {Restaurant} from "../component"
import { db } from "../../db";


function AllRestaurants() {
  const [allRestaurants, setAllRestaurants] = useState([]);
  useEffect(() => {
    const getRestaurants = async () => {
      const allUsers = await db.localUserData.toArray();
      const allRestaurants =
        allUsers.filter((user) => user.role === "seller") || [];

      setAllRestaurants(allRestaurants);
    };
    getRestaurants();
  }, []);

  return (
    <>
      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
        {allRestaurants.map((r, i) => {
          return (
            <Restaurant
              key={i}
              defaultRest={defaultRest}
              name={r.restaurant_name}
              address={r.restaurant_address}
              productsLength={r.productList?.length || 0}
              id={r.id}
            />
          );
        })}
      </div>
    </>
  );
}

export default AllRestaurants;
