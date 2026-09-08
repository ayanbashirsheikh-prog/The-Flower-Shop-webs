import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config();

// =====================================================
// ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Add these later when their files exist:
//
// import userRoutes from "./routes/userRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";
// import couponRoutes from "./routes/couponRoutes.js";

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// PATH SETUP
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// ENV VARIABLES
// =====================================================

const PORT = Number(process.env.PORT) || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

// =====================================================
// BASIC SECURITY
// =====================================================

app.disable("x-powered-by");

// =====================================================
// HELMET
// =====================================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =====================================================
// COOKIE PARSER
// =====================================================

app.use(cookieParser());

// =====================================================
// RATE LIMITER
// =====================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

// Apply rate limit to API

app.use("/api", apiLimiter);

// =====================================================
// STATIC UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "The Flower Shop API is running 🌸",
    environment:
      process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// API ROOT
// =====================================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to The Flower Shop API 🌸",
  });
});

// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

// =====================================================
// PRODUCT ROUTES
// =====================================================

app.use(
  "/api/products",
  productRoutes
);

// =====================================================
// FUTURE ROUTES
// =====================================================

// app.use("/api/users", userRoutes);

// app.use("/api/orders", orderRoutes);

// app.use("/api/categories", categoryRoutes);

// app.use("/api/reviews", reviewRoutes);

// app.use("/api/coupons", couponRoutes);

// =====================================================
// 404 API HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "🔥 GLOBAL SERVER ERROR:",
      error
    );

    // -----------------------------------------------
    // JSON PARSING ERROR
    // -----------------------------------------------

    if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      error.type === "entity.parse.failed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON request",
      });
    }

    // -----------------------------------------------
    // MULTER FILE ERROR
    // -----------------------------------------------

    if (
      error.name === "MulterError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "File upload error",
      });
    }

    // -----------------------------------------------
    // DEFAULT ERROR
    // -----------------------------------------------

    return res.status(
      error.statusCode || 500
    ).json({
      success: false,

      message:
        error.message ||
        "Internal server error",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
);

// =====================================================
// DATABASE CONNECTION
// =====================================================

const connectDatabase = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from .env"
      );
    }

    const connection =
      await mongoose.connect(
        MONGO_URI
      );

    console.log(
      `✅ MongoDB connected: ${connection.connection.host}`
    );

    console.log(
      `📦 Database: ${connection.connection.name}`
    );
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

// =====================================================
// SERVER START
// =====================================================

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(
      PORT,
      () => {
        console.log("");
        console.log(
          "🌸 ======================================="
        );
        console.log(
          "🌸      THE FLOWER SHOP API"
        );
        console.log(
          "🌸 ======================================="
        );
        console.log(
          `🚀 Server: http://localhost:${PORT}`
        );
        console.log(
          `💚 Health: http://localhost:${PORT}/api/health`
        );
        console.log(
          `🌷 Products: http://localhost:${PORT}/api/products`
        );
        console.log(
          `🔐 Auth: http://localhost:${PORT}/api/auth`
        );
        console.log(
          `📁 Uploads: http://localhost:${PORT}/uploads`
        );
        console.log(
          "🌸 ======================================="
        );
        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

// =====================================================
// PROCESS ERROR HANDLING
// =====================================================

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "❌ Unhandled Promise Rejection:",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ Uncaught Exception:",
      error
    );

    process.exit(1);
  }
);

// =====================================================
// START
// =====================================================

startServer();