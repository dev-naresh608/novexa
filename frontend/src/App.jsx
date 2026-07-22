import {
  AddressContextProvider,
  CartProductContextProvider,
  OrderHistoryContextProvider,
  ProductContextProvider,
  UserContext,
  UserContextProvider,
  WishlistContextProvider,
  CategoryContextProvider,
  OrderContext,
} from "./contexts/context";

import React from "react";

const Profile = React.lazy(() => import("./pages/profile/Profile"));
const PersonalInfo = React.lazy(() => import("./pages/profile/PersonalInfo"));
const Setting = React.lazy(() => import("./pages/profile/Setting"));
const Payments = React.lazy(() => import("./pages/profile/Payments"));
const Orders = React.lazy(() => import("./modules/order/pages/OrdersPage.jsx"));
const OrderDetail = React.lazy(() => import("./modules/order/pages/OrderDetailPage.jsx"));
const CartPage = React.lazy(() => import("./modules/cart/pages/CartPage.jsx"));
const Home = React.lazy(() => import("./pages/home/Home"));
const ProductListPage = React.lazy(() => import("./modules/seller/pages/ProductListPage.jsx"));
const ProductDetailPage = React.lazy(() => import("./modules/seller/pages/ProductDetailPage.jsx"));
const AddProduct = React.lazy(() => import("./modules/seller/pages/AddProduct.jsx"));
const ActiveOrders = React.lazy(() => import("./modules/order/ActiveOrders.jsx"));
const Wishlist = React.lazy(() => import("./pages/profile/Wishlist"));
const Category = React.lazy(() => import("./pages/home/Category"));
const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));
const DeliveryHistory = React.lazy(() => import("./pages/driver/DeliveryHistory"));
const VehicleDetails = React.lazy(() => import("./pages/driver/VehicleDetails"));
const Earnings = React.lazy(() => import("./pages/driver/Earnings"));
const ShowAllNotifications = React.lazy(() => import("./pages/notification/ShowAllNotifications"));

const AllProducts = React.lazy(() => import("./components/store/features/products/AllProducts.jsx"));
const CategoryWiseProducts = React.lazy(() => import("./components/store/pages/CategoryWiseProducts.jsx"));
const SearchProduct = React.lazy(() => import("./components/store/features/products/SearchProduct.jsx"));
const AllStores = React.lazy(() => import("./components/store/pages/AllStores.jsx"));

import Layout from "./components/Layout.jsx";
import { useModal, MODAL_TYPES } from "./components";

import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate,
  Outlet,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import { useEffect, useContext } from "react";
import OrderProvider from "./contexts/OrderContext";

const LoginRedirect = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
    openModal(MODAL_TYPES.LOGIN);
  }, [openModal, navigate]);
  return null;
};

const SignupRedirect = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
    openModal(MODAL_TYPES.SIGNUP);
  }, [openModal, navigate]);
  return null;
};

const ProtectedRoute = () => {
  const { isLogin } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/login", { replace: true });
    }
  }, [isLogin, navigate]);

  if (!isLogin) {
    return null;
  }

  return <Outlet />;
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        {/* ! general path */}

        <Route path="/login" element={<LoginRedirect />}></Route>
        <Route path="/signup" element={<SignupRedirect />}></Route>
        {/* ! end of general paths */}

        {/* ! show in panel  */}
        <Route path="/" element={<Home />}>
          {/* Public Routes */}
          <Route path="categories" element={<Category />}></Route>
          <Route
            path="categories/categoryWiseProducts/:catName"
            element={<CategoryWiseProducts />}
          />
          <Route path="cart" element={<CartPage />}></Route>
          <Route path="stores" element={<AllStores />}></Route>
          <Route path="/stores/allproducts/:restId" element={<AllProducts />} />
          <Route path="allproduct" element={<AllProducts />}></Route>
          <Route
            path="/allproducts/searchproduct/:searchValue"
            element={<SearchProduct />}
          />
          <Route path="product/:productId" element={<ProductDetailPage />}></Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="favourite" element={<Wishlist />}></Route>
            <Route path="orders" element={<Orders />}></Route>
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="wishlist" element={<Wishlist />}></Route>
            <Route path="setting" element={<Setting />}></Route>
            <Route path="dashboard" element={<Dashboard />}></Route>
            <Route path="addproducts" element={<AddProduct />}></Route>
            <Route path="product-list" element={<ProductListPage />}></Route>
            <Route path="active-orders" element={<ActiveOrders />}></Route>
            <Route path="allnotifications" element={<ShowAllNotifications />}></Route>
            <Route path="deliveryHistory" element={<DeliveryHistory />}></Route>
            <Route path="earnings" element={<Earnings />}></Route>
            <Route path="vehicleDetails" element={<VehicleDetails />}></Route>
          </Route>
        </Route>
        {/* ! end to show in panel  */}

        {/* ! profile path  */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />}>
            <Route path="personalinformation" element={<PersonalInfo />}></Route>
            <Route path="payments" element={<PersonalInfo />}></Route>
            <Route path="setting" element={<Setting />}></Route>
          </Route>
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
