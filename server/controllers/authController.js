import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================================================
// CREATE JWT
// =====================================================

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
  }

  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================================
// COOKIE OPTIONS
// =====================================================

const cookieOptions = {
  httpOnly: true,

  secure:
    process.env.NODE_ENV === "production",

  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",

  maxAge:
    7 *
    24 *
    60 *
    60 *
    1000,

  path: "/",
};

// =====================================================
// SAFE USER
// =====================================================

const getSafeUser = (user) => {
  return {
    id: user._id.toString(),

    name: user.name,

    email: user.email,

    phone: user.phone || "",

    avatar: user.avatar || "",

    role: user.role,

    isActive: user.isActive,
  };
};

// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // -------------------------------------------------
    // REQUIRED
    // -------------------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    // -------------------------------------------------
    // NORMALIZE EMAIL
    // -------------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------
    // CHECK EXISTING USER
    // -------------------------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // -------------------------------------------------
    // CREATE USER
    // IMPORTANT:
    // User schema uses "customer", NOT "user"
    // -------------------------------------------------

    const user = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      phone: phone?.trim() || "",

      role: "customer",

      isActive: true,
    });

    // -------------------------------------------------
    // CREATE TOKEN
    // -------------------------------------------------

    const token = createToken(
      user._id.toString()
    );

    // -------------------------------------------------
    // HTTP ONLY COOKIE
    // -------------------------------------------------

    res.cookie(
      "token",
      token,
      cookieOptions
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      user: getSafeUser(user),
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
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
          (item) => item.message
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
        "Unable to create account",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

export const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -------------------------------------------------
    // REQUIRED
    // -------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // -------------------------------------------------
    // NORMALIZE EMAIL
    // -------------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -------------------------------------------------
    // ACTIVE ACCOUNT CHECK
    // -------------------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated",
      });
    }

    // -------------------------------------------------
    // PASSWORD CHECK
    // -------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -------------------------------------------------
    // CREATE JWT
    // -------------------------------------------------

    const token = createToken(
      user._id.toString()
    );

    // -------------------------------------------------
    // SAVE JWT IN HTTP-ONLY COOKIE
    // -------------------------------------------------

    res.cookie(
      "token",
      token,
      cookieOptions
    );

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      user: getSafeUser(user),
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to login",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};

// =====================================================
// LOGOUT
// =====================================================

export const logoutUser = async (
  req,
  res
) => {
  try {
    res.clearCookie(
      "token",
      cookieOptions
    );

    return res.status(200).json({
      success: true,

      message:
        "Logged out successfully",
    });
  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to logout",
    });
  }
};