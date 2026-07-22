import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/context";
import { SellerDashboard, CustomerDashboard, DriverDashboard } from "..";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, isLogin } = useContext(UserContext);

  useEffect(() => {
    if (!isLogin) {
      navigate("/", { replace: true });
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }

  if (currentUser.role === "customer") {
    return <CustomerDashboard />;
  }
  if (currentUser.role === "seller") {
    return <SellerDashboard />;
  }
  if (currentUser.role === "driver") {
    return <DriverDashboard />;
  }
  if (currentUser.role === "admin") {
    return <h2> Admin Dashboard</h2>;
  }
  return null;
}

export default Dashboard;
