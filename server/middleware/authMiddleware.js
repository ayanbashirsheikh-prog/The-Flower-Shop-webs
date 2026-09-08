import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (
  req,
  res,
  next
) => {
  try {
    let token = null;

    // =================================================
    // 1. HTTP-ONLY COOKIE
    // =================================================

    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // =================================================
    // 2. OPTIONAL BEARER TOKEN
    // =================================================

    if (
      !token &&
      req.headers.authorization?.startsWith(
        "Bearer "
      )
    ) {
      token =
        req.headers.authorization
          .split(" ")[1]
          ?.trim();
    }

    // =================================================
    // 3. TOKEN REQUIRED
    // =================================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // =================================================
    // 4. JWT SECRET
    // =================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET missing from .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication configuration error",
      });
    }

    // =================================================
    // 5. VERIFY TOKEN
    // =================================================

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    // =================================================
    // 6. USER ID
    // =================================================

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token",
      });
    }

    // =================================================
    // 7. FIND USER
    // =================================================

    const user =
      await User.findById(
        decoded.id
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account no longer exists",
      });
    }

    // =================================================
    // 8. ACTIVE CHECK
    // =================================================

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated",
      });
    }

    // =================================================
    // 9. ATTACH USER
    // =================================================

    req.user = user;

    // =================================================
    // 10. CONTINUE
    // =================================================

    next();
  } catch (error) {
    console.error(
      "AUTHENTICATION ERROR:",
      error.message
    );

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Session expired. Please login again.",
      });
    }

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Authentication failed",
    });
  }
};