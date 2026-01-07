import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";

dotenv.config();

import mainRoutes from "./routes/index.js";
import incidentRoutes from "./routes/incidents.js";
import { errorHandler, requestLogger } from "./middleware/index.js";
import * as fileService from "./services/fileService.js";
import * as incidentService from "./services/incidentService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security
app.use(helmet());

// Parse CORS_ORIGIN (comma-separated) from env
const corsOriginEnv = process.env.CORS_ORIGIN || "";
const extraOrigins = corsOriginEnv
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:2999",
      "http://localhost:4200",
      ...extraOrigins,
    ];
    
    if (!origin) {
      // Allow requests with no Origin header (e.g., same-origin or mobile app requests)
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log rejected origin for debugging
      console.warn(`[CORS] Rejected request from origin: ${origin}`);
      console.warn(`[CORS] Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));

// Body parsing - but skip for upload-image which uses FormData
app.use((req, res, next) => {
  // Skip JSON parsing for FormData uploads
  if (req.path === "/api/incidents/upload-image" || req.path.startsWith("/api/incidents/upload-image")) {
    return next();
  }
  return express.json({ limit: "10mb" })(req, res, next);
});

app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(requestLogger);

// Static files with CORS headers
const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(UPLOAD_DIR));

// Serve public static (so images saved to public/static/incident are accessible)
// Use absolute path from workspace root to ensure it works in both dev (src/) and prod (dist/)
const WORKSPACE_ROOT = path.join(__dirname, "..", "..");
const PUBLIC_STATIC_DIR = path.join(WORKSPACE_ROOT, "public", "static");
console.log(`[Static Files] Serving /static from: ${PUBLIC_STATIC_DIR}`);
app.use("/static", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(PUBLIC_STATIC_DIR));

// Swagger UI (serves OpenAPI spec at /api/docs)
const SWAGGER_PATH = path.join(__dirname, "swagger.json");
let swaggerSpec = {};
try {
  const raw = fs.readFileSync(SWAGGER_PATH, "utf-8");
  swaggerSpec = JSON.parse(raw);
} catch (err) {
  console.warn(`[Swagger] Could not load ${SWAGGER_PATH}:`, err.message || err);
}
if (Object.keys(swaggerSpec).length > 0) {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  // Provide a lightweight UI that shows an error message when spec missing
  app.get('/api/docs', (req, res) => {
    res.status(500).send('Swagger spec not found. Please ensure backend/src/swagger.json exists.');
  });
}

// Routes (upload route must come before the body-parser middleware applies)
app.use("/api", mainRoutes);
app.use("/api/incidents", incidentRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Incident Management API - Quick Report",
    version: "1.0.0",
    status: "running",
  });
});

// Diagnostic endpoint to verify CORS and connectivity
app.get("/api/ping", (req, res) => {
  res.json({
    success: true,
    message: "Backend is reachable",
    timestamp: new Date().toISOString(),
    origin: req.get("origin") || "none",
    corsAllowed: corsOriginEnv || "localhost only",
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    timestamp: new Date().toISOString(),
  });
});

// Start server
async function startServer() {
  try {
    await fileService.ensureUploadDir();
    // Load mock persistence (if any)
    if (typeof incidentService.initMockPersistence === 'function') {
      await incidentService.initMockPersistence();
    }
    
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  Incident Management API Started      ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                          
║  Env: ${NODE_ENV}                        
║  Uploads: ${UPLOAD_DIR}                   
╚════════════════════════════════════════╝

📍 API: http://localhost:${PORT}/api
📸 Upload: POST /api/incidents/upload-image
📋 Quick Report: POST /api/incidents/quick-report
📊 Get All: GET /api/incidents
🔍 Get By ID: GET /api/incidents/:id
⚙️  Update: PUT /api/incidents/:id/status
📈 Stats: GET /api/incidents/stats/overview
❤️  Health: GET /api/health
      `);
    });
  } catch (error) {
    console.error("Failed to start:", error);
    process.exit(1);
  }
}

startServer();

export default app;
