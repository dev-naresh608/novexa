import {
  AddressContextProvider,
  CartProductContextProvider,
  OrderHistoryContextProvider,
  ProductContextProvider,
  UserContextProvider,
  WishlistContextProvider,
  CategoryContextProvider,
  OrderContext,
} from "./client/contexts/context";

import {
  Profile,
  PersonalInfo,
  Setting,
  Payments,
  Orders,
  OrderDetail,
  CartPage,
  Home,
  Login,
  Signup,
  ProductList,
  AddProduct,
  ActiveOrders,
  Wishlist,
  Category,
  Dashboard,
  DeliveryHistory,
  VehicleDetails,
  Earnings,
  ShowAllNotifications,
} from "./client/index";



import {
  AllProducts,
  CategoryWiseProducts,
  Layout,
  SearchProduct,
  AllStores,
} from "./client/components";

import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import OrderProvider from "./client/contexts/OrderContext";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* ! general path */}

        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="allproduct" element={<AllProducts />}></Route>
        <Route
          path="/allproducts/searchproduct/:searchValue"
          element={<SearchProduct />}
        />
        {/* ! end of general paths */}

        {/* ! show in panel  */}
        <Route path="/" element={<Home />}>
          {/* <Route path="" element={<Dashboard />}></Route> */}
          <Route path="categories" element={<Category />}></Route>
          <Route
            path="categories/categoryWiseProducts/:catName"
            element={<CategoryWiseProducts />}
          />
          <Route path="favourite" element={<Wishlist />}></Route>
          <Route path="orders" element={<Orders />}></Route>
          <Route path="orders/:orderId" element={<OrderDetail />} />
          {/* <Route path="cart" element={<Cart />}></Route> */}
          <Route path="cart" element={<CartPage />}></Route>
          <Route path="wishlist" element={<Wishlist />}></Route>
          <Route path="setting" element={<Setting />}></Route>
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="stores" element={<AllStores />}></Route>
          <Route path="addproducts" element={<AddProduct />}></Route>
          <Route path="product-list" element={<ProductList />}></Route>
          <Route path="active-orders" element={<ActiveOrders />}></Route>
          <Route
            path="allnotifications"
            element={<ShowAllNotifications />}
          ></Route>
          <Route path="deliveryHistory" element={<DeliveryHistory />}></Route>
          <Route path="earnings" element={<Earnings />}></Route>
          <Route path="vehicleDetails" element={<VehicleDetails />}></Route>

          <Route path="/stores/allproducts/:restId" element={<AllProducts />} />
        </Route>
        {/* ! end to show in panel  */}

        {/* ! profile path  */}
        <Route path="profile" element={<Profile />}>
          <Route path="personalinformation" element={<PersonalInfo />}></Route>
          <Route path="payments" element={<PersonalInfo />}></Route>
          <Route path="setting" element={<Setting />}></Route>
        </Route>
        {/* ! end - profile path  */}
      </Route>,
    ),
  );

  return (
    <>
      <UserContextProvider>
        <CartProductContextProvider>
          <ProductContextProvider>
            <AddressContextProvider>
              <OrderHistoryContextProvider>
                <WishlistContextProvider>
                  <CategoryContextProvider>
                    <OrderProvider>
                      <RouterProvider router={router} />
                    </OrderProvider>
                  </CategoryContextProvider>
                </WishlistContextProvider>
              </OrderHistoryContextProvider>
            </AddressContextProvider>
          </ProductContextProvider>
        </CartProductContextProvider>
      </UserContextProvider>
    </>
  );
}
export default App;
