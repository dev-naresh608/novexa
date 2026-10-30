import Order from "../order.model.js";
import Seller from "../../seller/seller.model.js";
import { addOrderSvc, findSingleOrderSvc } from "./orderHistory.service.js";
import { paginate, getPaginationParams } from "../../../utils/pagination.js";

const ACTIVE_STATUSES = [
  "pending",
  "preparing",
  "confirmed",
  "processing",
  "shipped",
  "ready",
  "out_for_delivery",
];

export const handleGetAllOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status } = req.query;
    const { page, limit, sort, search } = getPaginationParams(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let filter = {};

    switch (role) {
      case "customer": {
        filter = {
          customer_id: userId,
        };
        break;
      }
      case "seller": {
        let sellerStoreId = userId;
        const seller = await Seller.findOne({
          $or: [{ _id: userId }, { user_id: userId }],
        });
        if (seller) {
          sellerStoreId = seller._id;
        }
        filter = {
          $or: [{ store_id: userId }, { store_id: sellerStoreId }],
        };
        break;
      }
      case "driver": {
        filter = {
          driver_id: userId,
        };
        break;
      }
      default: {
        filter = {
          $or: [
            { customer_id: userId },
            { store_id: userId },
            { driver_id: userId },
          ],
        };
        break;
      }
    }

    // Optional status filter
    if (status) {
      if (status === "active") {
        filter.order_status = { $in: ACTIVE_STATUSES };
      } else if (status === "completed") {
        filter.order_status = { $in: ["completed", "delivered"] };
      } else if (status === "cancelled") {
        filter.order_status = { $in: ["rejected", "cancelled"] };
      } else {
        filter.order_status = status;
      }
    }

    if (search) {
      filter.$and = [
        ...(filter.$and || []),
        {
          $or: [
            { payment_method: { $regex: search, $options: "i" } },
            { order_status: { $regex: search, $options: "i" } },
            { store_name: { $regex: search, $options: "i" } },
            { customer_name: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    // Base filter without order_status for summary statistics
    const baseFilter = { ...filter };
    delete baseFilter.order_status;

    // Run pagination and summary counts in parallel
    const [paginated, activeCount, completedCount, cancelledCount] =
      await Promise.all([
        paginate(Order, filter, { page, limit, sort }),
        Order.countDocuments({
          ...baseFilter,
          order_status: { $in: ACTIVE_STATUSES },
        }),
        Order.countDocuments({
          ...baseFilter,
          order_status: { $in: ["completed", "delivered"] },
        }),
        Order.countDocuments({
          ...baseFilter,
          order_status: { $in: ["rejected", "cancelled"] },
        }),
      ]);

    return res.json({
      success: true,
      message: "Orders fetched successfully",
      orders: paginated.data,
      pagination: paginated.pagination,
      summary: {
        total: paginated.pagination.totalItems,
        active: activeCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleAddOrder = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: "Payload is required",
      });
    }
    const result = await addOrderSvc(payload);

    if (!result?.success) {
      return res.status(400).json({
        success: false,
        message: result?.message || "Order placement failed",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: result.order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const handleFindOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const result = await findSingleOrderSvc(orderId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleDeleteOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndDelete(orderId);
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
