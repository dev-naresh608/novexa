import EmptyOrders from "./components/common/EmptyOrders";
import DashboardCard from "./components/cards/DashboardCard";
import dashboardCardsConfig from "./config/dashboardCardsConfig";
import OrderStatusPill from "./components/table/OrderStatusPill";
// import orderFilterConfig from "./config/orderFilterConfig.js";
import orderStatusConfig from "./config/orderStatusConfig";
import tableHeaderConfig from "./config/tableHeaderConfig";
import OrdersTable from "./components/table/OrdersTable";

// search order
import OrderSearchBar from "./components/filters/OrderSearchBar";
import {searchOrders} from "./services/orderFilterService";


export {
  EmptyOrders,
  DashboardCard,
  OrderStatusPill,
  orderStatusConfig,
  // orderFilterConfig,
  dashboardCardsConfig,
  tableHeaderConfig,
  OrdersTable,
  OrderSearchBar,
  searchOrders,
};
