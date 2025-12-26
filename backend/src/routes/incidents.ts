import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import * as incidentController from "../controllers/incidentController.js";

const router = Router();

// Multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880"),
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

/**
 * Upload image
 * POST /api/incidents/upload-image
 */
router.post("/upload-image", upload.single("file"), incidentController.uploadImage);

/**
 * Quick report
 * POST /api/incidents/quick-report
 */
router.post(
  "/quick-report",
  [
    body("imageUrl").isString().notEmpty().withMessage("Image URL required"),
    body("type").notEmpty().withMessage("Type required"),
    body("location").notEmpty().withMessage("Location required"),
    body("description").optional().isString().trim(),
    body("timestamp").isISO8601().withMessage("Invalid timestamp"),
  ],
  incidentController.createQuickReport
);

/**
 * Get all
 * GET /api/incidents
 */
router.get("/", incidentController.getAllIncidents);

/**
 * Get by ID
 * GET /api/incidents/:id
 */
router.get("/:id", incidentController.getIncident);

/**
 * Update status
 * PUT /api/incidents/:id/status
 */
router.put(
  "/:id/status",
  [
    body("status").notEmpty(),
    body("note").optional().isString(),
  ],
  incidentController.updateIncidentStatus
);

/**
 * Stats
 * GET /api/incidents/stats/overview
 */
router.get("/stats/overview", incidentController.getStatistics);

export default router;
