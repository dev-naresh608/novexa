import { MapPin, Star, StarOff, StarsIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Store({  defaultRest, name, address, productsLength, id }) {

  return (
    <div
      className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
    >
      <img
        src={defaultRest}
        alt="store image"
        className="w-28 h-28 rounded-xl object-cover"
      />

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>

          <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={16} strokeWidth={2.5}/> {address}</p>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1"><Star fill="#166534" size={16} strokeWidth={1}/> 4.3</span>
          <span>🛒 {productsLength} items</span>
        </div>

        <Link
          to={`/allproducts/${id}`}
          className="font-semibold px-4 py-2 bg-black/10 rounded-full text-green-800 text-sm w-fit"
        >
          View Products
        </Link>
      </div>
    </div>
  );
}

export default Store;
