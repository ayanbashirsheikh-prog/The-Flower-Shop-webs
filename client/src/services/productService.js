import axios from "axios";

/**
 * =========================================================
 * PRODUCT API SERVICE
 * =========================================================
 *
 * Centralized API layer for all product-related requests.
 *
 * Features:
 * - Fetch products
 * - Search
 * - Category filtering
 * - Featured / bestseller / new arrival
 * - Price filtering
 * - Stock filtering
 * - Pagination
 * - Fetch single product
 * - Create product
 * - Update product
 * - Delete product
 * =========================================================
 */

/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const PRODUCTS_URL =
  `${API_BASE_URL}/products`;

/* =========================================================
   AXIOS INSTANCE
========================================================= */

const productApi = axios.create({
  baseURL: PRODUCTS_URL,

  headers: {
    Accept: "application/json",
  },

  timeout: 15000,
});

/* =========================================================
   REQUEST ERROR HELPER
========================================================= */

const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.status === 404) {
    return "Product service was not found.";
  }

  if (error?.response?.status === 401) {
    return "Please login to continue.";
  }

  if (error?.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (error?.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (!error?.response) {
    return "Unable to connect to the server.";
  }

  return (
    error?.message ||
    "Something went wrong while processing the request."
  );
};

/* =========================================================
   NORMALIZE RESPONSE
========================================================= */

const normalizeResponse = (response) => {
  return {
    success:
      response?.data?.success ?? true,

    message:
      response?.data?.message || "",

    products:
      Array.isArray(response?.data?.products)
        ? response.data.products
        : [],

    product:
      response?.data?.product || null,

    count:
      Number(response?.data?.count) || 0,

    total:
      Number(response?.data?.total) || 0,

    page:
      Number(response?.data?.page) || 1,

    pages:
      Number(response?.data?.pages) || 0,
  };
};

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

/**
 * Fetch products with optional filters.
 *
 * Example:
 *
 * getProducts({
 *   category: "roses",
 *   featured: true,
 *   page: 1,
 *   limit: 12
 * });
 */

export const getProducts = async (
  params = {}
) => {
  try {
    const response =
      await productApi.get("/", {
        params,
      });

    return normalizeResponse(response);
  } catch (error) {
    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    throw new Error(
      getErrorMessage(error)
    );
  }
};

/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

/**
 * Fetch one product by MongoDB ObjectId.
 */

export const getProductById = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  try {
    const response =
      await productApi.get(
        `/${productId}`
      );

    return normalizeResponse(response);
  } catch (error) {
    console.error(
      "GET PRODUCT ERROR:",
      error
    );

    throw new Error(
      getErrorMessage(error)
    );
  }
};

/* =========================================================
   CREATE PRODUCT
========================================================= */

/**
 * Create product using FormData.
 *
 * Supports:
 * - Product image
 * - Product information
 * - Variants
 * - Stock
 * - SEO
 * - Delivery settings
 */

export const createProduct = async (
  productData
) => {
  try {
    const formData =
      productData instanceof FormData
        ? productData
        : createProductFormData(
            productData
          );

    const response =
      await productApi.post(
        "/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return normalizeResponse(response);
  } catch (error) {
    console.error(
      "CREATE PRODUCT ERROR:",
      error
    );

    throw new Error(
      getErrorMessage(error)
    );
  }
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const updateProduct = async (
  productId,
  productData
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  try {
    const formData =
      productData instanceof FormData
        ? productData
        : createProductFormData(
            productData
          );

    const response =
      await productApi.put(
        `/${productId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return normalizeResponse(response);
  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );

    throw new Error(
      getErrorMessage(error)
    );
  }
};

/* =========================================================
   DELETE PRODUCT
========================================================= */

export const deleteProduct = async (
  productId
) => {
  if (!productId) {
    throw new Error(
      "Product ID is required."
    );
  }

  try {
    const response =
      await productApi.delete(
        `/${productId}`
      );

    return normalizeResponse(response);
  } catch (error) {
    console.error(
      "DELETE PRODUCT ERROR:",
      error
    );

    throw new Error(
      getErrorMessage(error)
    );
  }
};

/* =========================================================
   CREATE FORMDATA
========================================================= */

const createProductFormData = (
  data = {}
) => {
  const formData =
    new FormData();

  /* -------------------------------------------------------
     BASIC INFORMATION
  ------------------------------------------------------- */

  appendIfExists(
    formData,
    "name",
    data.name
  );

  appendIfExists(
    formData,
    "description",
    data.description
  );

  appendIfExists(
    formData,
    "shortDescription",
    data.shortDescription
  );

  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  appendIfExists(
    formData,
    "category",
    data.category
  );

  appendIfExists(
    formData,
    "subcategory",
    data.subcategory
  );

  /* -------------------------------------------------------
     VARIANTS
  ------------------------------------------------------- */

  if (
    data.variants !== undefined
  ) {
    formData.append(
      "variants",
      JSON.stringify(
        data.variants
      )
    );
  }

  /* -------------------------------------------------------
     INVENTORY
  ------------------------------------------------------- */

  appendIfExists(
    formData,
    "stockKg",
    data.stockKg
  );

  appendIfExists(
    formData,
    "lowStockThresholdKg",
    data.lowStockThresholdKg
  );

  /* -------------------------------------------------------
     SKU
  ------------------------------------------------------- */

  appendIfExists(
    formData,
    "sku",
    data.sku
  );

  /* -------------------------------------------------------
     PRODUCT DETAILS
  ------------------------------------------------------- */

  appendIfExists(
    formData,
    "size",
    data.size
  );

  appendIfExists(
    formData,
    "color",
    data.color
  );

  appendIfExists(
    formData,
    "flowerType",
    data.flowerType
  );

  /* -------------------------------------------------------
     OCCASIONS
  ------------------------------------------------------- */

  if (
    Array.isArray(
      data.occasion
    )
  ) {
    formData.append(
      "occasion",
      data.occasion.join(",")
    );
  } else {
    appendIfExists(
      formData,
      "occasion",
      data.occasion
    );
  }

  /* -------------------------------------------------------
     FLAGS
  ------------------------------------------------------- */

  appendBoolean(
    formData,
    "featured",
    data.featured
  );

  appendBoolean(
    formData,
    "bestseller",
    data.bestseller
  );

  appendBoolean(
    formData,
    "newArrival",
    data.newArrival
  );

  appendBoolean(
    formData,
    "isActive",
    data.isActive
  );

  /* -------------------------------------------------------
     DELIVERY
  ------------------------------------------------------- */

  appendBoolean(
    formData,
    "deliveryAvailable",
    data.deliveryAvailable
  );

  appendBoolean(
    formData,
    "sameDayDelivery",
    data.sameDayDelivery
  );

  /* -------------------------------------------------------
     SEO
  ------------------------------------------------------- */

  appendIfExists(
    formData,
    "metaTitle",
    data.metaTitle
  );

  appendIfExists(
    formData,
    "metaDescription",
    data.metaDescription
  );

  /* -------------------------------------------------------
     IMAGE
  ------------------------------------------------------- */

  if (
    data.image instanceof File
  ) {
    formData.append(
      "image",
      data.image
    );
  }

  return formData;
};

/* =========================================================
   FORMDATA HELPERS
========================================================= */

const appendIfExists = (
  formData,
  key,
  value
) => {
  if (
    value !== undefined &&
    value !== null &&
    value !== ""
  ) {
    formData.append(
      key,
      String(value)
    );
  }
};

const appendBoolean = (
  formData,
  key,
  value
) => {
  if (
    value !== undefined &&
    value !== null
  ) {
    formData.append(
      key,
      String(Boolean(value))
    );
  }
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};