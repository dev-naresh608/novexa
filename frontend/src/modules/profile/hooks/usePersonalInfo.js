import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/context";
import { handleGetAddressApi } from "../../address/services/address.service.api";

export const usePersonalInfo = () => {
  const { currentUser, setActiveTab } = useContext(UserContext);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUser?._id) return;
      setLoading(true);
      try {
        const data = await handleGetAddressApi(currentUser._id);
        if (data && data.success) {
          setAddresses(data.addressList || []);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [currentUser?._id]);

  const lastUsedAddress = currentUser?.address || addresses[0] || null;

  const totalOrders = currentUser?.myOrders?.length || 0;

  return {
    currentUser,
    lastUsedAddress,
    loading,
    totalOrders,
    setActiveTab,
    navigate,
  };
};
