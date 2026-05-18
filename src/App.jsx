import {
  AddressContextProvider,
  CartProductContextProvider,
  OrderHistoryContextProvider,
  ProductContextProvider,
  UserContextProvider,
  WishlistContextProvider,
  CategoryContextProvider,
} from "./client/contexts/context";

import {
  AllProducts,
  CategoryWiseProducts,
  Layout,
  Profile,
  PersonalInfo,
  Setting,
  Payments,
  Orders,
  Cart,
  Home,
  Login,
  Signup,
  SearchProduct,
  AddressForm,
  MyProducts,
  AddProduct,
  Wishlist,
  Category,
  Dashboard,
  ProductList,
  ActiveDeliveries,
  DeliveryHistory,
  VehicleDetails,
  Earnings,
} from "./client/components/index";

import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* ! general path */}

        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="allproduct" element={<AllProducts />}></Route>
        <Route path="addressform" element={<AddressForm />}></Route>
        <Route
          path="/allproducts/searchproduct/:searchValue"
          element={<SearchProduct />}
        />
        {/* ! end of general paths */}

        {/* ! show in panel  */}
        <Route path="/" element={<Home />}>
          {/* <Route path="" element={<Dashboard />}></Route> */}
          <Route path="categories" element={<Category />}></Route>
          <Route path="favourite" element={<Wishlist />}></Route>
          <Route path="orders" element={<Orders />}></Route>
          <Route path="cart" element={<Cart />}></Route>
          <Route path="wishlist" element={<Wishlist />}></Route>
          <Route path="setting" element={<Setting />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/allproducts" element={<AllProducts />}></Route>
          <Route path="addproducts" element={<AddProduct />}></Route>
          <Route path="product-list" element={<MyProducts />}></Route>
          <Route path="activeDeliveries" element={<ActiveDeliveries />}>
            {" "}
          </Route>
          <Route path="deliveryHistory" element={<DeliveryHistory />}>
            {" "}
          </Route>
          <Route path="earnings" element={<Earnings />}>
            {" "}
          </Route>
          <Route path="vehicleDetails" element={<VehicleDetails />}>
            {" "}
          </Route>

          <Route
            path="/categories/categoryWiseProducts/:catName"
            element={<CategoryWiseProducts />}
          />
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
                    <RouterProvider router={router} />
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
