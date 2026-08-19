import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCustomers,
      totalOrders,
      revenueResult,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments(),

      User.countDocuments({
        role: "customer",
      }),

      Order.countDocuments(),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            status: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalPrice",
            },
          },
        },
      ]),

      Order.countDocuments({
        status: "Ordered",
      }),

      Order.countDocuments({
        status: "Processing",
      }),

      Order.countDocuments({
        status: "Shipped",
      }),

      Order.countDocuments({
        status: "Delivered",
      }),

      Order.find()
        .populate("user", "name email")
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean(),

      Product.find({
        stock: {
          $lte: 5,
        },
      })
        .sort({
          stock: 1,
        })
        .limit(8)
        .lean(),
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].total
        : 0;

    return res.status(200).json({
      success: true,

      stats: {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,

        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
      },

      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error(
      "DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load dashboard statistics",
    });
  }
};