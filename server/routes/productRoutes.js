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

/* =====================================================
   PUBLIC PRODUCT ROUTES
===================================================== */

/*
  GET /api/products
*/

router.get(
  "/",
  getProducts
);

/*
  GET /api/products/:id
*/

router.get(
  "/:id",
  getProductById
);

/* =====================================================
   ADMIN PRODUCT ROUTES
===================================================== */

/*
  POST /api/products

  FormData:

  image   -> main image
  images  -> additional images
*/

router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 9,
    },
  ]),
  createProduct
);

/*
  PUT /api/products/:id
*/

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 9,
    },
  ]),
  updateProduct
);

/*
  DELETE /api/products/:id
*/

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default router;