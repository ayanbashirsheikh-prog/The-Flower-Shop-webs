import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * =========================================================
 * PUBLIC PRODUCT ROUTES
 * =========================================================
 */

/**
 * GET /api/products
 *
 * Get all products
 */
router.get("/", getProducts);

/**
 * GET /api/products/:id
 *
 * Get single product
 */
router.get("/:id", getProductById);

/**
 * =========================================================
 * ADMIN PRODUCT ROUTES
 * =========================================================
 */

/**
 * POST /api/products
 *
 * Create product
 *
 * Authentication:
 * protect
 *
 * Authorization:
 * adminOnly
 *
 * Upload:
 * image
 */
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createProduct
);

/**
 * PUT /api/products/:id
 *
 * Update product
 */
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

/**
 * DELETE /api/products/:id
 *
 * Delete product
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;