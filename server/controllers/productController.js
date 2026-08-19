import Product from "../models/Product.js";

/* =====================================================
   HELPERS
===================================================== */

const toBoolean = (
  value,
  defaultValue = false
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true";
};

const toNumber = (
  value,
  defaultValue = 0
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : defaultValue;
};

const parseOccasions = (
  occasion
) => {
  if (Array.isArray(occasion)) {
    return occasion
      .map((item) =>
        String(item).trim()
      )
      .filter(Boolean);
  }

  if (typeof occasion === "string") {
    return occasion
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

/* =====================================================
   VARIANT PARSER
===================================================== */

const parseVariants = (
  variants
) => {
  let parsed = variants;

  /* -------------------------------------------------
     FormData sends arrays as JSON strings
  ------------------------------------------------- */

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch (error) {
      throw new Error(
        "Invalid variants format"
      );
    }
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      "Product variants must be an array"
    );
  }

  /* -------------------------------------------------
     Allowed weights
  ------------------------------------------------- */

  const allowedWeights = [
    0.25,
    0.5,
    1,
  ];

  const result = parsed.map(
    (variant) => {
      const weightKg = Number(
        variant.weightKg
      );

      const price = Number(
        variant.price
      );

      const compareAtPrice =
        Number(
          variant.compareAtPrice || 0
        );

      if (
        !allowedWeights.includes(
          weightKg
        )
      ) {
        throw new Error(
          "Only 250g, 500g and 1KG pack sizes are allowed"
        );
      }

      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {
        throw new Error(
          `Invalid price for ${variant.label || "pack"}`
        );
      }

      if (
        compareAtPrice < 0
      ) {
        throw new Error(
          `Invalid MRP for ${variant.label || "pack"}`
        );
      }

      if (
        compareAtPrice > 0 &&
        compareAtPrice < price
      ) {
        throw new Error(
          `MRP cannot be lower than selling price for ${variant.label || "pack"}`
        );
      }

      let discountPercentage = 0;

      if (
        compareAtPrice > 0 &&
        compareAtPrice > price
      ) {
        discountPercentage =
          Math.round(
            ((compareAtPrice -
              price) /
              compareAtPrice) *
              100
          );
      }

      let label =
        variant.label;

      if (!label) {
        if (weightKg === 0.25) {
          label = "250 g";
        }

        if (weightKg === 0.5) {
          label = "500 g";
        }

        if (weightKg === 1) {
          label = "1 KG";
        }
      }

      return {
        weightKg,
        label,
        price,
        compareAtPrice,
        discountPercentage,
        isActive:
          variant.isActive !== false,
      };
    }
  );

  /* -------------------------------------------------
     Remove duplicate sizes
  ------------------------------------------------- */

  const weights =
    result.map(
      (item) => item.weightKg
    );

  if (
    new Set(weights).size !==
    weights.length
  ) {
    throw new Error(
      "Duplicate pack sizes are not allowed"
    );
  }

  return result.sort(
    (a, b) =>
      a.weightKg - b.weightKg
  );
};

/* =====================================================
   UPLOADED IMAGES
===================================================== */

const getUploadedImages = (
  req,
  productName
) => {
  if (
    !req.files ||
    !Array.isArray(req.files)
  ) {
    return [];
  }

  return req.files.map(
    (file) => ({
      url: `/uploads/products/${file.filename}`,
      alt:
        productName || "",
    })
  );
};

/* =====================================================
   CREATE PRODUCT
===================================================== */

export const createProduct =
  async (req, res) => {
    try {
      const {
        name,
        description,
        shortDescription,

        variants,

        category,
        subcategory,

        stockKg,
        lowStockThresholdKg,

        sku,

        size,
        color,
        flowerType,
        occasion,

        featured,
        bestseller,
        newArrival,

        deliveryAvailable,
        sameDayDelivery,

        metaTitle,
        metaDescription,
      } = req.body;

      /* -------------------------------------------------
         REQUIRED
      ------------------------------------------------- */

      if (
        !name ||
        !description ||
        !category
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, description and category are required",
        });
      }

      /* -------------------------------------------------
         VARIANTS
      ------------------------------------------------- */

      let productVariants;

      try {
        productVariants =
          parseVariants(
            variants
          );
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      if (
        productVariants.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one pack size is required",
        });
      }

      /* -------------------------------------------------
         SKU
      ------------------------------------------------- */

      let normalizedSKU;

      if (sku?.trim()) {
        normalizedSKU =
          sku
            .trim()
            .toUpperCase();

        const existingSKU =
          await Product.findOne({
            sku: normalizedSKU,
          });

        if (existingSKU) {
          return res.status(409).json({
            success: false,
            message:
              "A product with this SKU already exists",
          });
        }
      }

      /* -------------------------------------------------
         MAIN IMAGE
      ------------------------------------------------- */

      let image = "";

      if (req.file) {
        image =
          `/uploads/products/${req.file.filename}`;
      }

      /* -------------------------------------------------
         MULTIPLE IMAGES
      ------------------------------------------------- */

      const images =
        getUploadedImages(
          req,
          name
        );

      /* -------------------------------------------------
         OCCASIONS
      ------------------------------------------------- */

      const occasions =
        parseOccasions(
          occasion
        );

      /* -------------------------------------------------
         STOCK
      ------------------------------------------------- */

      const stock =
        toNumber(
          stockKg,
          0
        );

      const lowStockThreshold =
        toNumber(
          lowStockThresholdKg,
          5
        );

      if (stock < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Stock cannot be negative",
        });
      }

      /* -------------------------------------------------
         CREATE
      ------------------------------------------------- */

      const product =
        await Product.create({
          name:
            name.trim(),

          description:
            description.trim(),

          shortDescription:
            shortDescription
              ?.trim() || "",

          category:
            category
              .trim()
              .toLowerCase(),

          subcategory:
            subcategory
              ?.trim()
              .toLowerCase() ||
            "",

          /* PACK SIZES */

          variants:
            productVariants,

          /* INVENTORY */

          stockKg:
            stock,

          lowStockThresholdKg:
            lowStockThreshold,

          /* SKU */

          sku:
            normalizedSKU,

          /* IMAGES */

          image,

          images,

          /* DETAILS */

          size:
            size?.trim() || "",

          color:
            color?.trim() || "",

          flowerType:
            flowerType
              ?.trim() || "",

          occasion:
            occasions,

          /* FLAGS */

          featured:
            toBoolean(
              featured
            ),

          bestseller:
            toBoolean(
              bestseller
            ),

          newArrival:
            toBoolean(
              newArrival,
              true
            ),

          isActive:
            true,

          /* DELIVERY */

          deliveryAvailable:
            toBoolean(
              deliveryAvailable,
              true
            ),

          sameDayDelivery:
            toBoolean(
              sameDayDelivery
            ),

          /* SEO */

          metaTitle:
            metaTitle
              ?.trim() || "",

          metaDescription:
            metaDescription
              ?.trim() || "",
        });

      return res.status(201).json({
        success: true,
        message:
          "Product created successfully 🌸",
        product,
      });
    } catch (error) {
      console.error(
        "CREATE PRODUCT ERROR:",
        error
      );

      if (
        error.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            "A product with this SKU or slug already exists",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        const messages =
          Object.values(
            error.errors
          ).map(
            (item) =>
              item.message
          );

        return res.status(400).json({
          success: false,
          message:
            messages.join(", "),
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to create product",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

/* =====================================================
   GET ALL PRODUCTS
===================================================== */

export const getProducts =
  async (req, res) => {
    try {
      const {
        category,
        featured,
        bestseller,
        newArrival,
        isActive,
        search,

        minPrice,
        maxPrice,

        inStock,
        lowStock,

        limit = 50,
        page = 1,
      } = req.query;

      const filter = {};

      /* -------------------------------------------------
         ACTIVE
      ------------------------------------------------- */

      if (
        isActive === undefined
      ) {
        filter.isActive = true;
      } else {
        filter.isActive =
          isActive === "true";
      }

      /* -------------------------------------------------
         CATEGORY
      ------------------------------------------------- */

      if (category?.trim()) {
        filter.category =
          category
            .trim()
            .toLowerCase();
      }

      /* -------------------------------------------------
         FLAGS
      ------------------------------------------------- */

      if (
        featured === "true"
      ) {
        filter.featured = true;
      }

      if (
        bestseller === "true"
      ) {
        filter.bestseller = true;
      }

      if (
        newArrival === "true"
      ) {
        filter.newArrival = true;
      }

      /* -------------------------------------------------
         PRICE FILTER
         pricePerKg is still maintained
      ------------------------------------------------- */

      if (
        minPrice !== undefined ||
        maxPrice !== undefined
      ) {
        filter.pricePerKg = {};

        if (
          minPrice !== undefined
        ) {
          filter.pricePerKg.$gte =
            Number(minPrice);
        }

        if (
          maxPrice !== undefined
        ) {
          filter.pricePerKg.$lte =
            Number(maxPrice);
        }
      }

      /* -------------------------------------------------
         STOCK
      ------------------------------------------------- */

      if (
        inStock === "true"
      ) {
        filter.stockKg = {
          $gt: 0,
        };
      }

      if (
        lowStock === "true"
      ) {
        filter.stockKg = {
          $gt: 0,
          $lte: 5,
        };
      }

      /* -------------------------------------------------
         SEARCH
      ------------------------------------------------- */

      if (search?.trim()) {
        filter.$text = {
          $search:
            search.trim(),
        };
      }

      /* -------------------------------------------------
         PAGINATION
      ------------------------------------------------- */

      const pageNumber =
        Math.max(
          Number(page) || 1,
          1
        );

      const limitNumber =
        Math.min(
          Math.max(
            Number(limit) || 50,
            1
          ),
          100
        );

      const skip =
        (pageNumber - 1) *
        limitNumber;

      /* -------------------------------------------------
         DATABASE
      ------------------------------------------------- */

      const [
        products,
        total,
      ] = await Promise.all([
        Product.find(filter)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(
            limitNumber
          ),

        Product.countDocuments(
          filter
        ),
      ]);

      return res.status(200).json({
        success: true,

        count:
          products.length,

        total,

        page:
          pageNumber,

        pages:
          Math.ceil(
            total /
              limitNumber
          ),

        products,
      });
    } catch (error) {
      console.error(
        "GET PRODUCTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch products",
      });
    }
  };

/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

export const getProductById =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(
        "GET PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch product",
      });
    }
  };

/* =====================================================
   UPDATE PRODUCT
===================================================== */

export const updateProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      /* -------------------------------------------------
         BASIC
      ------------------------------------------------- */

      if (
        req.body.name !==
        undefined
      ) {
        product.name =
          req.body.name.trim();
      }

      if (
        req.body.description !==
        undefined
      ) {
        product.description =
          req.body.description.trim();
      }

      if (
        req.body.shortDescription !==
        undefined
      ) {
        product.shortDescription =
          req.body
            .shortDescription
            ?.trim() || "";
      }

      /* -------------------------------------------------
         CATEGORY
      ------------------------------------------------- */

      if (
        req.body.category !==
        undefined
      ) {
        product.category =
          req.body.category
            .trim()
            .toLowerCase();
      }

      if (
        req.body.subcategory !==
        undefined
      ) {
        product.subcategory =
          req.body
            .subcategory
            ?.trim()
            .toLowerCase() ||
          "";
      }

      /* -------------------------------------------------
         VARIANTS
      ------------------------------------------------- */

      if (
        req.body.variants !==
        undefined
      ) {
        try {
          product.variants =
            parseVariants(
              req.body.variants
            );
        } catch (error) {
          return res.status(400).json({
            success: false,
            message:
              error.message,
          });
        }
      }

      /* -------------------------------------------------
         STOCK
      ------------------------------------------------- */

      if (
        req.body.stockKg !==
        undefined
      ) {
        const stock =
          Number(
            req.body.stockKg
          );

        if (
          !Number.isFinite(
            stock
          ) ||
          stock < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Stock KG cannot be negative",
          });
        }

        product.stockKg =
          stock;
      }

      if (
        req.body.lowStockThresholdKg !==
        undefined
      ) {
        product.lowStockThresholdKg =
          toNumber(
            req.body
              .lowStockThresholdKg,
            5
          );
      }

      /* -------------------------------------------------
         SKU
      ------------------------------------------------- */

      if (
        req.body.sku !==
        undefined
      ) {
        const newSKU =
          req.body.sku
            ?.trim()
            .toUpperCase();

        if (newSKU) {
          const existingSKU =
            await Product.findOne({
              sku: newSKU,
              _id: {
                $ne:
                  product._id,
              },
            });

          if (existingSKU) {
            return res.status(409).json({
              success: false,
              message:
                "A product with this SKU already exists",
            });
          }

          product.sku =
            newSKU;
        } else {
          product.sku =
            undefined;
        }
      }

      /* -------------------------------------------------
         DETAILS
      ------------------------------------------------- */

      if (
        req.body.size !==
        undefined
      ) {
        product.size =
          req.body.size
            ?.trim() || "";
      }

      if (
        req.body.color !==
        undefined
      ) {
        product.color =
          req.body.color
            ?.trim() || "";
      }

      if (
        req.body.flowerType !==
        undefined
      ) {
        product.flowerType =
          req.body.flowerType
            ?.trim() || "";
      }

      if (
        req.body.occasion !==
        undefined
      ) {
        product.occasion =
          parseOccasions(
            req.body.occasion
          );
      }

      /* -------------------------------------------------
         FLAGS
      ------------------------------------------------- */

      if (
        req.body.featured !==
        undefined
      ) {
        product.featured =
          toBoolean(
            req.body.featured
          );
      }

      if (
        req.body.bestseller !==
        undefined
      ) {
        product.bestseller =
          toBoolean(
            req.body.bestseller
          );
      }

      if (
        req.body.newArrival !==
        undefined
      ) {
        product.newArrival =
          toBoolean(
            req.body.newArrival
          );
      }

      if (
        req.body.isActive !==
        undefined
      ) {
        product.isActive =
          toBoolean(
            req.body.isActive
          );
      }

      /* -------------------------------------------------
         DELIVERY
      ------------------------------------------------- */

      if (
        req.body.deliveryAvailable !==
        undefined
      ) {
        product.deliveryAvailable =
          toBoolean(
            req.body
              .deliveryAvailable
          );
      }

      if (
        req.body.sameDayDelivery !==
        undefined
      ) {
        product.sameDayDelivery =
          toBoolean(
            req.body
              .sameDayDelivery
          );
      }

      /* -------------------------------------------------
         SEO
      ------------------------------------------------- */

      if (
        req.body.metaTitle !==
        undefined
      ) {
        product.metaTitle =
          req.body.metaTitle
            ?.trim() || "";
      }

      if (
        req.body.metaDescription !==
        undefined
      ) {
        product.metaDescription =
          req.body
            .metaDescription
            ?.trim() || "";
      }

      /* -------------------------------------------------
         IMAGE
      ------------------------------------------------- */

      if (req.file) {
        const newImage =
          `/uploads/products/${req.file.filename}`;

        product.image =
          newImage;

        product.images.push({
          url: newImage,
          alt:
            product.name,
        });
      }

      /* -------------------------------------------------
         SAVE
      ------------------------------------------------- */

      await product.save();

      return res.status(200).json({
        success: true,
        message:
          "Product updated successfully 🌸",
        product,
      });
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      if (
        error.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            "A product with this SKU or slug already exists",
        });
      }

      if (
        error.name ===
        "ValidationError"
      ) {
        const messages =
          Object.values(
            error.errors
          ).map(
            (item) =>
              item.message
          );

        return res.status(400).json({
          success: false,
          message:
            messages.join(", "),
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to update product",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  };

/* =====================================================
   DELETE PRODUCT
===================================================== */

export const deleteProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      /* Soft delete */

      product.isActive =
        false;

      await product.save();

      return res.status(200).json({
        success: true,
        message:
          "Product removed successfully 🌸",
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete product",
      });
    }
  };