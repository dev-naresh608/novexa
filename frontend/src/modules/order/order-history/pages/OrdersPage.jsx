import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { updateUser } from "@/modules/auth/store/authSlice";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, Sparkles, Clock } from "lucide-react";

import {
  OrderDashboardCard as DashboardCard,
  EmptyOrders,
  OrdersPageSkeleton,
  OrdersTableBodySkeleton,
  dashboardCardsConfig,
  OrdersTable,
  searchOrdersSvc,
  getAllOrdersSvc,
  sortOrderByDate,
} from "../index";

import { SearchBar } from "@/components";
import { toast } from "react-toastify";

function Orders() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);

  const [allOrders, setAllOrders] = useState([]);
  const [activeCard, setActiveCard] = useState("total");
  const [searchValue, setSearchValue] = useState("");

  // Pagination & Summary state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationMeta, setPaginationMeta] = useState(null);
  const [summaryStats, setSummaryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const { data } = await getAllOrdersSvc(
          userId,
          currentUser.role || "customer",
          page,
          limit,
          searchValue
        );

        if (!data || !data.success) {
          return toast.error(data?.message || "Failed to fetch orders");
        }

        const ordersList = data.orders || data.allOrders || [];
        const sortedOrders = sortOrderByDate(ordersList, "desc");

        setAllOrders(sortedOrders);
        if (data.pagination) {
          setPaginationMeta(data.pagination);
        }
        if (data.summary) {
          setSummaryStats(data.summary);
        }
        dispatch(updateUser({ myOrders: ordersList }));
      } catch (err) {
        console.error("Fetch orders error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [userId, currentUser?.role, page, limit, searchValue, dispatch]);

  const filteredOrders = useMemo(() => {
    let list = allOrders;

    if (activeCard === "active") {
      list = list.filter(
        (o) =>
          !["completed", "delivered", "rejected", "cancelled"].includes(
            o.order_status
          )
      );
    } else if (activeCard === "completed") {
      list = list.filter(
        (o) => o.order_status === "completed" || o.order_status === "delivered"
      );
    } else if (activeCard === "cancelled") {
      list = list.filter(
        (o) => o.order_status === "rejected" || o.order_status === "cancelled"
      );
    }

    return searchOrdersSvc(list, searchValue);
  }, [allOrders, activeCard, searchValue]);

  const handleSearchChange = (val) => {
    setSearchValue(val);
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // Memoize dashboardCards at top level according to React Rules of Hooks
  const dashboardCards = useMemo(() => {
    return dashboardCardsConfig(
      currentUser,
      setActiveCard,
      allOrders,
      summaryStats
    );
  }, [currentUser, setActiveCard, allOrders, summaryStats]);

  // ===================== 1. LOADING STATE =====================
  // While fetching data on first load, render smooth shimmer skeleton
  if (loading && allOrders.length === 0 && !searchValue) {
    return <OrdersPageSkeleton />;
  }

  // ===================== 2. CLEAN EMPTY STATE =====================
  // If no orders exist in entire history, render pure empty state
  if (!loading && allOrders.length === 0 && !searchValue) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center p-4">
        <EmptyOrders currentUserRole={currentUser?.role} />
      </div>
    );
  }

  // ===================== 3. FULL ORDER HISTORY LAYOUT =====================
  const commonCss = "bg-white rounded-2xl border border-gray-200/90 shadow-xs";

  return (
    <div className="space-y-4 font-sans max-w-7xl mx-auto">
      {/* Active Orders Banner */}
      {summaryStats?.active > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-emerald-950">
                  You have {summaryStats.active} active order{summaryStats.active > 1 ? "s" : ""} in progress!
                </h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-medium">
                Live delivery and preparation status updates are in progress.
              </p>
            </div>
          </div>

          <Link
            to="/active-orders"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            <span>Track Live</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ================= HEADER CARDS ================= */}
      <div className={`${commonCss} p-3`}>
        <div className="flex items-center gap-3 overflow-x-auto">
          {dashboardCards.map((card, i) => (
            <DashboardCard
              key={card.id || i}
              card={card}
              isActive={activeCard === card.id}
            />
          ))}
        </div>
      </div>

      <div className={`${commonCss} space-y-3 p-4`}>
        {/* ================= ORDER FILTER HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex-1">
            <SearchBar
              searchValue={searchValue}
              setSearchValue={handleSearchChange}
            />
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-2 text-xs text-gray-500 self-end sm:self-auto shrink-0">
            <span>Per page:</span>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="bg-gray-50 border border-gray-200 text-gray-800 font-semibold text-xs rounded-xl px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* ================= LOADING & CONTENT STATE ================= */}
        {loading ? (
          <OrdersTableBodySkeleton count={limit > 6 ? 6 : limit} />
        ) : filteredOrders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <EmptyOrders
              currentUserRole={currentUser?.role}
              isSearchResult={Boolean(searchValue)}
              searchValue={searchValue}
              onClearSearch={() => setSearchValue("")}
            />
            {activeCard !== "total" && !searchValue && (
              <button
                type="button"
                onClick={() => setActiveCard("total")}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition cursor-pointer"
              >
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <OrdersTable
            currentUserRole={currentUser?.role}
            allOrders={filteredOrders}
          />
        )}

        {/* ================= PAGINATION CONTROLS ================= */}
        {paginationMeta && paginationMeta.totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
            <span>
              Showing page {paginationMeta.currentPage} of{" "}
              {paginationMeta.totalPages} ({paginationMeta.totalItems} orders)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={!paginationMeta.hasPrevPage}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition font-semibold"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>

              <button
                type="button"
                disabled={!paginationMeta.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition font-semibold"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
