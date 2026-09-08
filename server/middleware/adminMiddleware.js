/**
 * =====================================================
 * ADMIN AUTHORIZATION
 * =====================================================
 */

export const adminOnly = (req, res, next) => {
  try {
    // =====================================================
    // USER CHECK
    // =====================================================

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // =====================================================
    // ADMIN CHECK
    // =====================================================

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // =====================================================
    // ALLOWED
    // =====================================================

    next();
  } catch (error) {
    console.error(
      "👑 Admin authorization error:",
      error.message
    );

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
};