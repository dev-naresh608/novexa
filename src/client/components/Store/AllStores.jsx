import React, { useContext, useEffect, useState } from "react";
import { defaultRest } from "../../assets/assets";
import { UserContext } from "../../contexts/context";
import { Store } from "..";
import { db } from "../../db";
import axios from "axios";

function AllStores() {
  const [AllStores, setAllStores] = useState([]);
  const { currentUser, userData } = useContext(UserContext);
  useEffect(() => {
    try {
      const getStores = async () => {
        const { data } = await axios.get("http://localhost:5000/stores");
        
        if (!data.success) {
          toast.error(data.message);
          return;
        }
        setAllStores(data.result);
      };
      getStores();
    } catch (error) {
      console.log(error);
    }
  }, [currentUser, userData]);

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
              id={r._id}
            />
          );
        })}
      </div>
    </>
  );
}

export default AllStores;
