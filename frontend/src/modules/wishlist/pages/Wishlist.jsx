import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreCard, WishlistSkeleton } from "@/modules/seller";
import { defaultRest } from "@/assets";
import { getWishlistStoresApi } from "../services/wishlist.api";
import { Heart, ArrowRight } from "lucide-react";

function Wishlist() {
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [wishlistStores, setWishlistStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWishlist = async () => {
      if (!currentUser?._id && !currentUser?.id) {
        if (isMounted) setLoading(false);
        return;
      }
      const userId = currentUser._id || currentUser.id;
      try {
        const data = await getWishlistStoresApi(userId);
        if (!isMounted) return;
        if (data && data.success) {
          setWishlistStores(data.stores || []);
        }
      } catch (error) {
        if (isMounted) console.error("Failed to fetch wishlist stores:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchWishlist();
    return () => {
      isMounted = false;
    };
  }, [currentUser?._id, currentUser?.id]);

  // Keep wishlistStores in sync with Redux currentUser.myWishlist
  useEffect(() => {
    if (currentUser?.myWishlist) {
      const savedIds = new Set(
        currentUser.myWishlist.map((item) =>
          typeof item === "object" ? item._id || item.id : item
        )
      );
      setWishlistStores((prevStores) =>
        prevStores.filter((store) => savedIds.has(store._id || store.id))
      );
    }
  }, [currentUser?.myWishlist]);

  // Full body unified skeleton while loading
  if (loading) {
    return <WishlistSkeleton />;
  }

  // Loaded with stores
  if (wishlistStores.length > 0) {
    return (
      <div
        className="space-y-5 h-full max-h-[90vh] overflow-y-auto 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Favourite Stores
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Your saved grocery and convenience stores
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
          {wishlistStores.map((store) => (
            <StoreCard
              key={store._id}
              defaultRest={defaultRest}
              name={store.store_name}
              address={store.store_address}
              id={store._id}
              storeType={store.store_type || store.category || "General Store"}
              is_store_open={store.is_store_open !== false}
            />
          ))}
        </div>
      </div>
    );
  }

  // Clean empty state when 0 stores
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-3 shadow-xs">
        <Heart size={30} strokeWidth={2} className="text-emerald-600" />
      </div>
      <h2 className="text-lg font-bold text-gray-800">
        No Favourite Stores Yet 🏪
      </h2>
      <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
        You haven't added any stores to your favourites yet. Explore local stores and tap the heart icon to save them here.
      </p>
      <button
        type="button"
        onClick={() => navigate("/stores")}
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer border-none"
      >
        <span>Explore Stores</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default Wishlist;
