import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Routes
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// ==========================================
// APP INITIALIZATION
// ==========================================

const app = express();

// __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================================
// ENVIRONMENT VARIABLES
// ==========================================

const PORT = Number(process.env.PORT) || 5000;

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI;

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

// ==========================================
// BASIC SECURITY
// ==========================================

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ==========================================
// CORS CONFIGURATION
// ==========================================

// Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://the-flower-shop-webs.netlify.app",
  CLIENT_URL,
].filter(Boolean);

// Remove duplicate origins
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log("🌐 Allowed CORS Origins:");
uniqueOrigins.forEach((origin) => {
  console.log(`   → ${origin}`);
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (uniqueOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`❌ CORS blocked origin: ${origin}`);

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

// ==========================================
// BODY PARSERS
// ==========================================

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

// ==========================================
// COOKIE PARSER
// ==========================================

app.use(cookieParser());

// ==========================================
// RATE LIMITER
// ==========================================

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

app.use("/api", apiLimiter);

// ==========================================
// STATIC UPLOADS
// ==========================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "The Flower Shop API is running 🌸",

    environment:
      process.env.NODE_ENV || "development",

    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// API ROOT
// ==========================================

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Welcome to The Flower Shop API 🌸",
  });
});

// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Products
app.use(
  "/api/products",
  productRoutes
);

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "🔥 GLOBAL SERVER ERROR:",
      error
    );

    // JSON parsing error
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

    // Multer upload error
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

    // CORS error
    if (
      error.message ===
      "Not allowed by CORS"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "CORS policy blocked this request.",
      });
    }

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

// ==========================================
// DATABASE CONNECTION
// ==========================================

const connectDatabase = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from environment variables"
      );
    }

    const connection =
      await mongoose.connect(
        MONGO_URI
      );

    console.log("");
    console.log(
      "======================================="
    );
    console.log(
      "✅ MongoDB connected successfully"
    );
    console.log(
      `📡 Host: ${connection.connection.host}`
    );
    console.log(
      `📦 Database: ${connection.connection.name}`
    );
    console.log(
      "======================================="
    );
    console.log("");
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log("");
      console.log(
        "🌸 ======================================="
      );
      console.log(
        "🌸       THE FLOWER SHOP API"
      );
      console.log(
        "🌸 ======================================="
      );

      console.log(
        `🚀 Server running on port: ${PORT}`
      );

      console.log(
        `💚 Health: /api/health`
      );

      console.log(
        `🌷 Products: /api/products`
      );

      console.log(
        `🔐 Auth: /api/auth`
      );

      console.log(
        `📁 Uploads: /uploads`
      );

      console.log(
        `🌐 Frontend: ${CLIENT_URL}`
      );

      console.log(
        "🌸 ======================================="
      );

      console.log("");
    });
  } catch (error) {
    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

// ==========================================
// PROCESS ERROR HANDLERS
// ==========================================

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

// ==========================================
// START APPLICATION
// ==========================================

startServer();