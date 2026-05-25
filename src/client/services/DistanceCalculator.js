// Get distance
export const getDistance = async (lat1, lon1, lat2, lon2) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/distance?lat1=${lat1}&lon1=${lon1}&lat2=${lat2}&lon2=${lon2}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching distance:", error);
    return null;
  }
};

// Get address
export const getAddress = async (userAddress) => {

    if (!userAddress) {
    return {
      error: "Address is required",
    };
  }
  
  try {
    const response = await fetch(
      `http://localhost:5000/api/address?userAddress=${userAddress}`,
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching address:", error);
    return {err: "server is not runnig"};
  }
};
