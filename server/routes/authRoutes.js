import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post(
  "/register",
  registerUser
);

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post(
  "/login",
  loginUser
);

// =====================================================
// CURRENT USER
// GET /api/auth/me
// =====================================================

router.get(
  "/me",
  protect,
  (req, res) => {
    return res.status(200).json({
      success: true,

      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || "",
        avatar: req.user.avatar || "",
        role: req.user.role,
        isActive: req.user.isActive,
      },
    });
  }
);

// =====================================================
// LOGOUT
// POST /api/auth/logout
// =====================================================

router.post(
  "/logout",
  logoutUser
);

export default router;