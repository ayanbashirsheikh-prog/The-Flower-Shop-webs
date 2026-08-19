import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ============================================
// CREATE ORDER
// ============================================

export const createOrder = async (req, res) => {
  try {
    console.log("🛒 CREATE ORDER REQUEST");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const {
      items,
      address,
      paymentMethod,
      giftMessage = "",
      deliveryDate = "",
    } = req.body;

    // -----------------------------
    // Validate user
    // -----------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    // -----------------------------
    // Validate items
    // -----------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // -----------------------------
    // Validate address
    // -----------------------------

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "pincode",
    ];

    for (const field of requiredAddressFields) {
      if (!address[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    // -----------------------------
    // Validate payment
    // -----------------------------

    const allowedPaymentMethods = [
      "COD",
      "UPI",
      "GPay",
      "PhonePe",
      "Paytm",
    ];

    if (
      !allowedPaymentMethods.includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // -----------------------------
    // Verify products + stock
    // -----------------------------

    const orderItems = [];

    let subtotal = 0;

    for (const item of items) {
      const productId =
        item.product ||
        item.productId ||
        item.id ||
        item._id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Invalid product in cart",
        });
      }

      const product =
        await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} items available`,
        });
      }

      const itemTotal =
        Number(product.price) * quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image || "",
        price: Number(product.price),
        quantity,
      });
    }

    // -----------------------------
    // Delivery
    // -----------------------------

    const deliveryFee =
      subtotal >= 999 ? 0 : 79;

    const totalPrice =
      subtotal + deliveryFee;

    // -----------------------------
    // Create order
    // -----------------------------

    const order = await Order.create({
      user: req.user._id,

      items: orderItems,

      subtotal,

      deliveryFee,

      totalPrice,

      address: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      },

      paymentMethod,

      paymentStatus:
        paymentMethod === "COD"
          ? "Pending"
          : "Pending",

      status: "Ordered",

      giftMessage,

      deliveryDate,
    });

    // -----------------------------
    // Reduce stock
    // -----------------------------

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      );
    }

    console.log(
      "✅ ORDER CREATED:",
      order._id
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(
      "❌ CREATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to place order",
    });
  }
};

// ============================================
// GET MY ORDERS
// ============================================

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate(
        "items.product",
        "name image price"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "❌ GET MY ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET ALL ORDERS
// ============================================

export const getAllOrders = async (
  req,
  res
) => {
  try {
    const orders = await Order.find()
      .populate(
        "user",
        "name email phone"
      )
      .populate(
        "items.product",
        "name image price"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "❌ GET ALL ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET SINGLE ORDER
// ============================================

export const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone"
        )
        .populate(
          "items.product",
          "name image price"
        );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "❌ GET ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPDATE ORDER STATUS
// ============================================

export const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Ordered",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "❌ UPDATE STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPDATE PAYMENT STATUS
// ============================================

export const updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const { paymentStatus } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Paid",
      "Failed",
      "Refunded",
    ];

    if (
      !allowedStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid payment status",
      });
    }

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { paymentStatus },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Payment status updated successfully",
      order,
    });
  } catch (error) {
    console.error(
      "❌ UPDATE PAYMENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// DELETE ORDER
// ============================================

export const deleteOrder = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findByIdAndDelete(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Order deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ DELETE ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};