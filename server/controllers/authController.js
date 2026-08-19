import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// =====================================================
// REGISTER
// =====================================================

export const registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // -----------------------------
    // EXISTING USER
    // -----------------------------

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

    // -----------------------------
    // HASH PASSWORD
    // -----------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    // -----------------------------
    // CREATE CUSTOMER
    // -----------------------------

    const user =
      await User.create({
        name: name.trim(),

        email: normalizedEmail,

        password: hashedPassword,

        // NEVER allow public registration
        // to create an admin.
        role: "customer",
      });

    // -----------------------------
    // TOKEN
    // -----------------------------

    const token =
      generateToken(user);

    return res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token,
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create account",
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

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // -----------------------------
    // FIND USER
    // -----------------------------

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // -----------------------------
    // PASSWORD
    // -----------------------------

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

    // -----------------------------
    // FRESH TOKEN
    // -----------------------------

    const token =
      generateToken(user);

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },

      token,
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
    });
  }
};