import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token = null;

    // =================================================
    // COOKIE TOKEN
    // =================================================

    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // =================================================
    // BEARER TOKEN
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
    // TOKEN REQUIRED
    // =================================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    // =================================================
    // JWT SECRET CHECK
    // =================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "❌ JWT_SECRET missing from .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication configuration error",
      });
    }

    // =================================================
    // VERIFY TOKEN
    // =================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =================================================
    // ATTACH USER
    // =================================================

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "🔐 Authentication error:",
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

    return res.status(401).json({
      success: false,
      message:
        "Invalid authentication token",
    });
  }
};