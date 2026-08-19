import mongoose from "mongoose";

/* =========================================================
   ORDER ITEM SCHEMA
========================================================= */

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   DELIVERY ADDRESS SCHEMA
========================================================= */

const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name is too short"],
      maxlength: [100, "Name is too long"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: (value) =>
          /^[6-9]\d{9}$/.test(value),
        message: "Please enter a valid Indian mobile number",
      },
    },

    addressLine: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      maxlength: [300, "Address is too long"],
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [100, "City is too long"],
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: [100, "State is too long"],
    },

    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
      validate: {
        validator: (value) =>
          /^\d{6}$/.test(value),
        message: "Please enter a valid 6-digit pincode",
      },
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   PAYMENT DETAILS
========================================================= */

const paymentDetailsSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    paymentGateway: {
      type: String,
      enum: [
        "Manual",
        "GPay",
        "PhonePe",
        "Paytm",
        "UPI",
        "Razorpay",
      ],
      default: "Manual",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   ORDER SCHEMA
========================================================= */

const orderSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------
       ORDER NUMBER
    ------------------------------------------------------- */

    orderNumber: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },

    /* -------------------------------------------------------
       CUSTOMER
    ------------------------------------------------------- */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    /* -------------------------------------------------------
       PRODUCTS
    ------------------------------------------------------- */

    items: {
      type: [orderItemSchema],
      required: true,

      validate: {
        validator: (items) =>
          Array.isArray(items) &&
          items.length > 0,

        message:
          "Order must contain at least one product",
      },
    },

    /* -------------------------------------------------------
       PRICE DETAILS
    ------------------------------------------------------- */

    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Delivery fee cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },

    couponCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },

    /* -------------------------------------------------------
       DELIVERY ADDRESS
    ------------------------------------------------------- */

    address: {
      type: addressSchema,
      required: [true, "Delivery address is required"],
    },

    /* -------------------------------------------------------
       PAYMENT METHOD
    ------------------------------------------------------- */

    paymentMethod: {
      type: String,

      enum: [
        "COD",
        "UPI",
        "GPay",
        "PhonePe",
        "Paytm",
      ],

      required: [true, "Payment method is required"],
    },

    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],

      default: "Pending",

      index: true,
    },

    paymentDetails: {
      type: paymentDetailsSchema,
      default: () => ({}),
    },

    /* -------------------------------------------------------
       ORDER STATUS
    ------------------------------------------------------- */

    status: {
      type: String,

      enum: [
        "Ordered",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],

      default: "Ordered",

      index: true,
    },

    /* -------------------------------------------------------
       CANCELLATION
    ------------------------------------------------------- */

    cancellationReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Cancellation reason is too long"],
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    /* -------------------------------------------------------
       DELIVERY
    ------------------------------------------------------- */

    deliveryDate: {
      type: Date,
      default: null,
    },

    trackingNumber: {
      type: String,
      default: "",
      trim: true,
    },

    courierName: {
      type: String,
      default: "",
      trim: true,
    },

    /* -------------------------------------------------------
       GIFT
    ------------------------------------------------------- */

    giftMessage: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Gift message is too long"],
    },

    /* -------------------------------------------------------
       ADMIN NOTES
    ------------------------------------------------------- */

    adminNotes: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Admin notes are too long"],
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   GENERATE ORDER NUMBER
========================================================= */

orderSchema.pre("save", async function (next) {
  if (this.orderNumber) {
    return next();
  }

  const randomPart = Math.floor(
    100000 + Math.random() * 900000
  );

  this.orderNumber = `TFS-${Date.now()}-${randomPart}`;

  next();
});

/* =========================================================
   INDEXES
========================================================= */

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  status: 1,
  createdAt: -1,
});

orderSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

/* =========================================================
   MODEL
========================================================= */

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

export default Order;