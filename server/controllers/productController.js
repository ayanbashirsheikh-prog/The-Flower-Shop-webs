import mongoose from "mongoose";
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

  return String(value).toLowerCase() === "true";
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

const parseOccasions = (occasion) => {
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

const parseVariants = (variants) => {
  let parsed = variants;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
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

  if (parsed.length === 0) {
    throw new Error(
      "At least one pack size is required"
    );
  }

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

      const compareAtPrice = Number(
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
          `Invalid price for ${
            variant.label || "pack"
          }`
        );
      }

      if (
        !Number.isFinite(
          compareAtPrice
        ) ||
        compareAtPrice < 0
      ) {
        throw new Error(
          `Invalid MRP for ${
            variant.label || "pack"
          }`
        );
      }

      if (
        compareAtPrice > 0 &&
        compareAtPrice < price
      ) {
        throw new Error(
          `MRP cannot be lower than selling price for ${
            variant.label || "pack"
          }`
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
        variant.label?.trim();

      if (!label) {
        if (weightKg === 0.25) {
          label = "250 g";
        } else if (weightKg === 0.5) {
          label = "500 g";
        } else if (weightKg === 1) {
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

  const weights = result.map(
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
   UPLOADED FILE HELPERS
===================================================== */

const getFiles = (req, fieldName) => {
  if (
    !req.files ||
    !req.files[fieldName]
  ) {
    return [];
  }

  return req.files[fieldName];
};

const fileToImage = (
  file,
  alt = ""
) => {
  return {
    url: `/uploads/products/${file.filename}`,
    alt,
  };
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
        !name?.trim() ||
        !description?.trim() ||
        !category?.trim()
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
          parseVariants(variants);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      /* -------------------------------------------------
         SKU
      ------------------------------------------------- */

      let normalizedSKU;

      if (sku?.trim()) {
        normalizedSKU =
          sku.trim().toUpperCase();

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
         IMAGES
      ------------------------------------------------- */

      const mainImage =
        getFiles(req, "image")[0];

      const additionalImages =
        getFiles(req, "images");

      const image = mainImage
        ? `/uploads/products/${mainImage.filename}`
        : "";

      const images = [];

      if (mainImage) {
        images.push(
          fileToImage(
            mainImage,
            name.trim()
          )
        );
      }

      additionalImages.forEach(
        (file) => {
          images.push(
            fileToImage(
              file,
              name.trim()
            )
          );
        }
      );

      /* -------------------------------------------------
         OCCASIONS
      ------------------------------------------------- */

      const occasions =
        parseOccasions(occasion);

      /* -------------------------------------------------
         STOCK
      ------------------------------------------------- */

      const stock = toNumber(
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
          name: name.trim(),

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
              .toLowerCase() || "",

          variants:
            productVariants,

          stockKg: stock,

          lowStockThresholdKg:
            lowStockThreshold,

          sku: normalizedSKU,

          image,

          images,

          size:
            size?.trim() || "",

          color:
            color?.trim() || "",

          flowerType:
            flowerType?.trim() || "",

          occasion: occasions,

          featured: toBoolean(
            featured
          ),

          bestseller: toBoolean(
            bestseller
          ),

          newArrival: toBoolean(
            newArrival,
            true
          ),

          isActive: true,

          deliveryAvailable:
            toBoolean(
              deliveryAvailable,
              true
            ),

          sameDayDelivery:
            toBoolean(
              sameDayDelivery
            ),

          metaTitle:
            metaTitle?.trim() || "",

          metaDescription:
            metaDescription?.trim() ||
            "",
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

      if (error.code === 11000) {
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

      if (featured === "true") {
        filter.featured = true;
      }

      if (bestseller === "true") {
        filter.bestseller = true;
      }

      if (newArrival === "true") {
        filter.newArrival = true;
      }

      /* -------------------------------------------------
         PRICE
      ------------------------------------------------- */

      if (
        minPrice !== undefined ||
        maxPrice !== undefined
      ) {
        filter.pricePerKg = {};

        const min =
          Number(minPrice);

        const max =
          Number(maxPrice);

        if (
          minPrice !== undefined &&
          Number.isFinite(min)
        ) {
          filter.pricePerKg.$gte =
            min;
        }

        if (
          maxPrice !== undefined &&
          Number.isFinite(max)
        ) {
          filter.pricePerKg.$lte =
            max;
        }
      }

      /* -------------------------------------------------
         STOCK
      ------------------------------------------------- */

      if (inStock === "true") {
        filter.stockKg = {
          $gt: 0,
        };
      }

      if (lowStock === "true") {
        filter.$expr = {
          $and: [
            {
              $gt: [
                "$stockKg",
                0,
              ],
            },
            {
              $lte: [
                "$stockKg",
                "$lowStockThresholdKg",
              ],
            },
          ],
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

      const pageNumber = Math.max(
        Number(page) || 1,
        1
      );

      const limitNumber = Math.min(
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
          .limit(limitNumber),

        Product.countDocuments(
          filter
        ),
      ]);

      return res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: pageNumber,
        pages: Math.ceil(
          total / limitNumber
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
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product ID",
        });
      }

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
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product ID",
        });
      }

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
        req.body.name !== undefined
      ) {
        const name =
          req.body.name.trim();

        if (!name) {
          return res.status(400).json({
            success: false,
            message:
              "Product name cannot be empty",
          });
        }

        product.name = name;
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
            .toLowerCase() || "";
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
          !Number.isFinite(stock) ||
          stock < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Stock KG cannot be negative",
          });
        }

        product.stockKg = stock;
      }

      if (
        req.body.lowStockThresholdKg !==
        undefined
      ) {
        const threshold =
          Number(
            req.body
              .lowStockThresholdKg
          );

        if (
          !Number.isFinite(
            threshold
          ) ||
          threshold < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid low stock threshold",
          });
        }

        product.lowStockThresholdKg =
          threshold;
      }

      /* -------------------------------------------------
         SKU
      ------------------------------------------------- */

      if (
        req.body.sku !== undefined
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

          product.sku = newSKU;
        } else {
          product.sku = undefined;
        }
      }

      /* -------------------------------------------------
         DETAILS
      ------------------------------------------------- */

      if (
        req.body.size !== undefined
      ) {
        product.size =
          req.body.size
            ?.trim() || "";
      }

      if (
        req.body.color !== undefined
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
         IMAGES
      ------------------------------------------------- */

      const newMainImage =
        getFiles(req, "image")[0];

      const newAdditionalImages =
        getFiles(req, "images");

      if (newMainImage) {
        const newImage =
          `/uploads/products/${newMainImage.filename}`;

        product.image = newImage;

        product.images.push({
          url: newImage,
          alt: product.name,
        });
      }

      if (
        newAdditionalImages.length > 0
      ) {
        newAdditionalImages.forEach(
          (file) => {
            product.images.push({
              url: `/uploads/products/${file.filename}`,
              alt: product.name,
            });
          }
        );
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

      if (error.code === 11000) {
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
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid product ID",
        });
      }

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

      product.isActive = false;

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