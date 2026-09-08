import mongoose from "mongoose";

/* =====================================================
   PRODUCT IMAGE SCHEMA
===================================================== */

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =====================================================
   PRODUCT VARIANT / PACK SIZE SCHEMA
===================================================== */

const productVariantSchema = new mongoose.Schema(
  {
    /*
      0.25 = 250g
      0.5  = 500g
      1    = 1KG
    */

    weightKg: {
      type: Number,
      required: true,
      enum: [0.25, 0.5, 1],
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    compareAtPrice: {
      type: Number,
      default: 0,
      min: [0, "Compare price cannot be negative"],
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

/* =====================================================
   PRODUCT SCHEMA
===================================================== */

const productSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------
       BASIC INFORMATION
    ------------------------------------------------- */

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name is too short"],
      maxlength: [120, "Product name is too long"],
    },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description is too short"],
      maxlength: [3000, "Description is too long"],
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "Short description is too long"],
    },

    /* -------------------------------------------------
       CATEGORY
    ------------------------------------------------- */

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      lowercase: true,
      index: true,
    },

    subcategory: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    /* -------------------------------------------------
       VARIANTS
    ------------------------------------------------- */

    variants: {
      type: [productVariantSchema],
      required: true,

      validate: {
        validator: function (variants) {
          if (!Array.isArray(variants)) {
            return false;
          }

          if (variants.length === 0) {
            return false;
          }

          const allowedWeights = [0.25, 0.5, 1];

          const weights = variants.map((variant) =>
            Number(variant.weightKg)
          );

          if (
            weights.some(
              (weight) =>
                !allowedWeights.includes(weight)
            )
          ) {
            return false;
          }

          return (
            new Set(weights).size ===
            weights.length
          );
        },

        message:
          "Product must have valid unique pack sizes: 250g, 500g or 1KG",
      },
    },

    /* -------------------------------------------------
       PRICE REFERENCES
    ------------------------------------------------- */

    pricePerKg: {
      type: Number,
      default: 0,
      min: 0,
    },

    compareAtPricePerKg: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    unit: {
      type: String,
      enum: ["kg"],
      default: "kg",
    },

    /* -------------------------------------------------
       INVENTORY
       Stock is stored in KG
    ------------------------------------------------- */

    stockKg: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    lowStockThresholdKg: {
      type: Number,
      default: 5,
      min: [0, "Low stock threshold cannot be negative"],
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    /* -------------------------------------------------
       IMAGES
    ------------------------------------------------- */

    image: {
      type: String,
      default: "",
      trim: true,
    },

    images: {
      type: [productImageSchema],
      default: [],
    },

    /* -------------------------------------------------
       PRODUCT DETAILS
    ------------------------------------------------- */

    size: {
      type: String,
      default: "",
      trim: true,
    },

    color: {
      type: String,
      default: "",
      trim: true,
    },

    occasion: {
      type: [String],
      default: [],
    },

    flowerType: {
      type: String,
      default: "",
      trim: true,
    },

    /* -------------------------------------------------
       FLAGS
    ------------------------------------------------- */

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    bestseller: {
      type: Boolean,
      default: false,
      index: true,
    },

    newArrival: {
      type: Boolean,
      default: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /* -------------------------------------------------
       RATINGS
    ------------------------------------------------- */

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* -------------------------------------------------
       DELIVERY
    ------------------------------------------------- */

    deliveryAvailable: {
      type: Boolean,
      default: true,
    },

    sameDayDelivery: {
      type: Boolean,
      default: false,
    },

    /* -------------------------------------------------
       SEO
    ------------------------------------------------- */

    metaTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 320,
    },
  },

  {
    timestamps: true,
  }
);

/* =====================================================
   INDEXES
===================================================== */

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});

productSchema.index({
  category: 1,
  isActive: 1,
});

productSchema.index({
  featured: 1,
  isActive: 1,
});

productSchema.index({
  bestseller: 1,
  isActive: 1,
});

productSchema.index({
  newArrival: 1,
  isActive: 1,
});

productSchema.index({
  createdAt: -1,
});

productSchema.index({
  stockKg: 1,
  isActive: 1,
});

/* =====================================================
   SLUG HELPER
===================================================== */

const generateSlug = (text) => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

/* =====================================================
   PRE VALIDATE
===================================================== */

productSchema.pre("validate", function (next) {
  if (!this.variants || this.variants.length === 0) {
    return next(
      new Error(
        "At least one product pack size is required"
      )
    );
  }

  /* -------------------------------------------------
     Generate slug
  ------------------------------------------------- */

  if (this.isModified("name") || !this.slug) {
    this.slug = generateSlug(this.name);
  }

  /* -------------------------------------------------
     Variant discounts
  ------------------------------------------------- */

  this.variants.forEach((variant) => {
    if (
      variant.compareAtPrice > 0 &&
      variant.compareAtPrice > variant.price
    ) {
      variant.discountPercentage = Math.round(
        ((variant.compareAtPrice -
          variant.price) /
          variant.compareAtPrice) *
          100
      );
    } else {
      variant.discountPercentage = 0;
    }
  });

  next();
});

/* =====================================================
   PRE SAVE
===================================================== */

productSchema.pre("save", function (next) {
  const oneKgVariant = this.variants.find(
    (variant) =>
      Number(variant.weightKg) === 1
  );

  if (oneKgVariant) {
    this.pricePerKg = oneKgVariant.price;

    this.compareAtPricePerKg =
      oneKgVariant.compareAtPrice || 0;

    this.discountPercentage =
      oneKgVariant.discountPercentage || 0;
  } else {
    const firstVariant = this.variants[0];

    if (firstVariant) {
      this.pricePerKg =
        firstVariant.price /
        firstVariant.weightKg;

      this.compareAtPricePerKg =
        firstVariant.compareAtPrice > 0
          ? firstVariant.compareAtPrice /
            firstVariant.weightKg
          : 0;

      this.discountPercentage =
        firstVariant.discountPercentage || 0;
    }
  }

  next();
});

/* =====================================================
   VIRTUALS
===================================================== */

productSchema.virtual("isInStock").get(
  function () {
    return this.stockKg > 0;
  }
);

productSchema.virtual("isLowStock").get(
  function () {
    return (
      this.stockKg > 0 &&
      this.stockKg <=
        this.lowStockThresholdKg
    );
  }
);

productSchema.virtual("isOutOfStock").get(
  function () {
    return this.stockKg <= 0;
  }
);

productSchema.virtual("variant250g").get(
  function () {
    return this.variants.find(
      (variant) =>
        Number(variant.weightKg) === 0.25
    );
  }
);

productSchema.virtual("variant500g").get(
  function () {
    return this.variants.find(
      (variant) =>
        Number(variant.weightKg) === 0.5
    );
  }
);

productSchema.virtual("variant1kg").get(
  function () {
    return this.variants.find(
      (variant) =>
        Number(variant.weightKg) === 1
    );
  }
);

/* =====================================================
   JSON / OBJECT
===================================================== */

productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.set("toObject", {
  virtuals: true,
});

/* =====================================================
   MODEL
===================================================== */

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;