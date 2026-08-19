import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// =====================================================
// DATABASE
// =====================================================

import connectDB from "./config/db.js";

// =====================================================
// ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config();

// =====================================================
// APP
// =====================================================

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// =====================================================
// DATABASE
// =====================================================

connectDB();

// =====================================================
// SECURITY
// =====================================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    contentSecurityPolicy: false,
  })
);

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow curl / Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`🚫 CORS blocked: ${origin}`);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

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
// LOGGING
// =====================================================

if (NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// =====================================================
// BODY PARSERS
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

  max:
    NODE_ENV === "production"
      ? 300
      : 2000,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

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
// API ROUTES
// =====================================================

// -----------------------------
// AUTH
// -----------------------------

app.use(
  "/api/auth",
  authRoutes
);

// -----------------------------
// PRODUCTS
// -----------------------------

app.use(
  "/api/products",
  productRoutes
);

// -----------------------------
// ORDERS
// -----------------------------

app.use(
  "/api/orders",
  orderRoutes
);

// -----------------------------
// ADMIN
// -----------------------------

app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,

    message:
      "🌸 The Flower Shop API is running...",

    environment: NODE_ENV,

    version: "1.0.0",

    timestamp:
      new Date().toISOString(),
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/api/health",
  (req, res) => {
    const dbState =
      mongoose.connection.readyState;

    const database =
      dbState === 1
        ? "Connected"
        : dbState === 2
        ? "Connecting"
        : "Disconnected";

    const healthy =
      dbState === 1;

    return res
      .status(healthy ? 200 : 503)
      .json({
        success: healthy,

        message: healthy
          ? "API is healthy 🚀"
          : "Database is not connected",

        database,

        server: "Running",

        environment: NODE_ENV,

        timestamp:
          new Date().toISOString(),
      });
  }
);

// =====================================================
// API 404
// =====================================================

app.use(
  "/api",
  (req, res) => {
    return res.status(404).json({
      success: false,

      message: "API route not found",

      path: req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL 404
// =====================================================

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,

      message: "Route not found",

      path: req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "\n🔥 SERVER ERROR:"
    );

    console.error(err);

    // -----------------------------
    // CORS
    // -----------------------------

    if (
      err.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,

        message:
          "CORS policy blocked this request.",
      });
    }

    // -----------------------------
    // JSON ERROR
    // -----------------------------

    if (
      err instanceof SyntaxError &&
      err.status === 400 &&
      err.type ===
        "entity.parse.failed"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid JSON request body.",
      });
    }

    // -----------------------------
    // MULTER
    // -----------------------------

    if (
      err.name === "MulterError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          err.message ||
          "File upload error.",
      });
    }

    // -----------------------------
    // MONGOOSE VALIDATION
    // -----------------------------

    if (
      err.name ===
      "ValidationError"
    ) {
      const errors = Object.values(
        err.errors
      ).map(
        (error) => error.message
      );

      return res.status(400).json({
        success: false,

        message:
          "Validation failed",

        errors,
      });
    }

    // -----------------------------
    // DUPLICATE KEY
    // -----------------------------

    if (err.code === 11000) {
      const field =
        Object.keys(
          err.keyPattern || {}
        )[0] || "field";

      return res.status(409).json({
        success: false,

        message:
          `${field} already exists.`,
      });
    }

    // -----------------------------
    // DEFAULT
    // -----------------------------

    const statusCode =
      err.statusCode ||
      err.status ||
      500;

    return res
      .status(statusCode)
      .json({
        success: false,

        message:
          NODE_ENV ===
          "production"
            ? "Internal Server Error"
            : err.message ||
              "Internal Server Error",
      });
  }
);

// =====================================================
// START SERVER
// =====================================================

const server = app.listen(
  PORT,
  () => {
    console.log("");

    console.log(
      "=========================================="
    );

    console.log(
      "🌸 THE FLOWER SHOP API"
    );

    console.log(
      "=========================================="
    );

    console.log(
      `🚀 Server: http://localhost:${PORT}`
    );

    console.log(
      `🔐 Auth: http://localhost:${PORT}/api/auth`
    );

    console.log(
      `🌹 Products: http://localhost:${PORT}/api/products`
    );

    console.log(
      `🛒 Orders: http://localhost:${PORT}/api/orders`
    );

    console.log(
      `👑 Admin: http://localhost:${PORT}/api/admin`
    );

    console.log(
      `📁 Uploads: http://localhost:${PORT}/uploads`
    );

    console.log(
      `❤️ Health: http://localhost:${PORT}/api/health`
    );

    console.log(
      `⚙️ Environment: ${NODE_ENV}`
    );

    console.log(
      "=========================================="
    );

    console.log("");
  }
);

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

const shutdown = async (signal) => {
  console.log(
    `\n🛑 ${signal} received.`
  );

  console.log(
    "Closing server..."
  );

  server.close(async () => {
    console.log(
      "✅ HTTP server closed."
    );

    try {
      await mongoose.connection.close();

      console.log(
        "✅ MongoDB connection closed."
      );

      process.exit(0);
    } catch (error) {
      console.error(
        "❌ MongoDB shutdown error:",
        error.message
      );

      process.exit(1);
    }
  });
};

// =====================================================
// PROCESS SIGNALS
// =====================================================

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

// =====================================================
// UNHANDLED ERRORS
// =====================================================

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "🔥 Unhandled Promise Rejection:",
      error
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "🔥 Uncaught Exception:",
      error
    );

    process.exit(1);
  }
);