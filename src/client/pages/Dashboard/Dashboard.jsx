import React, {useContext} from 'react'
import {UserContext} from "../../contexts/context"
import {SellerDashboard, CustomerDashboard, DriverDashboard} from "../../pages/pages"

function Dashboard() {
  const {currentUser} = useContext(UserContext)
  
  if(currentUser.role === "customer"){
    return <CustomerDashboard />
  }
  if(currentUser.role === "seller"){
    return <SellerDashboard />
  } 
  if(currentUser.role === "driver"){
    return <DriverDashboard />
  } 
  if(currentUser.role === "admin"){
    return <h2> Admin Dashboard</h2>
  } 
  return <h2>You are not customer,seller,admin then who you are</h2>

}

export default Dashboard
