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
import alertRoutes from "./routes/alerts.js";
import { errorHandler, requestLogger } from "./middleware/index.js";
import * as fileService from "./services/fileService.js";
import * as incidentService from "./services/incidentService.js";
import * as alertService from "./services/alertService.js";
import { swaggerSpec } from "./swagger.config.js";

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
      "http://localhost:3001", // Swagger UI
      ...extraOrigins,
    ];
    
    // Log all CORS requests for debugging
    console.log(`[CORS] Request from origin: ${origin || '(no origin - curl/postman/swagger)'}`);
    
    if (!origin) {
      // Allow requests with no Origin header (curl, Postman, Swagger, same-origin)
      console.log('[CORS] ✓ Allowing request with no origin header');
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] ✓ Allowing origin: ${origin}`);
      return callback(null, true);
    }
    
    // Log rejected origin for debugging
    console.warn(`[CORS] ✗ Rejected request from origin: ${origin}`);
    console.warn(`[CORS] Allowed origins: ${allowedOrigins.join(", ")}`);
    return callback(new Error("CORS not allowed"));
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
// __dirname = backend/src, so go up 3 levels to reach project root
const WORKSPACE_ROOT = path.join(__dirname, "..", "..", "..");
const PUBLIC_STATIC_DIR = path.join(WORKSPACE_ROOT, "public", "static");
console.log(`[Static Files] __dirname: ${__dirname}`);
console.log(`[Static Files] WORKSPACE_ROOT: ${WORKSPACE_ROOT}`);
console.log(`[Static Files] Serving /static from: ${PUBLIC_STATIC_DIR}`);
console.log(`[Static Files] Directory exists: ${fs.existsSync(PUBLIC_STATIC_DIR)}`);
app.use("/static", (req, res, next) => {
  console.log(`[Static Files] Request: ${req.method} ${req.path}`);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(PUBLIC_STATIC_DIR));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 version:
 *                   type: string
 *                 status:
 *                   type: string
 */

/**
 * @swagger
 * /api/ping:
 *   get:
 *     summary: Ping endpoint để kiểm tra kết nối
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Backend is reachable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 origin:
 *                   type: string
 *                 corsAllowed:
 *                   type: string
 */

// Swagger UI - Tự động cập nhật từ JSDoc comments
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Incident Management API Docs"
}));

// Routes (upload route must come before the body-parser middleware applies)
app.use("/api", mainRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api", alertRoutes);

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
    // Initialize alert DB
    if (typeof alertService.initAlertDB === 'function') {
      await alertService.initAlertDB();
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
� Swagger Docs: http://localhost:${PORT}/api/docs
�📸 Upload: POST /api/incidents/upload-image
📋 Quick Report: POST /api/incidents/quick-report
📊 Get All: GET /api/incidents
🔍 Get By ID: GET /api/incidents/:id
⚙️  Update: PUT /api/incidents/:id/status
📈 Stats: GET /api/incidents/stats/overview
❤️  Health: GET /api/health

🚨 Alerts API:
📰 Public Banners: GET /api/public/banners
🔐 Admin Alerts: GET /api/admin/alerts
➕ Create Alert: POST /api/admin/alerts
      `);
    });
  } catch (error) {
    console.error("Failed to start:", error);
    process.exit(1);
  }
}

startServer();

export default app;
