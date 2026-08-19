import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// ============================================
// REGISTER
// POST /api/auth/register
// ============================================

router.post("/register", registerUser);

// ============================================
// LOGIN
// POST /api/auth/login
// ============================================

router.post("/login", loginUser);

export default router;