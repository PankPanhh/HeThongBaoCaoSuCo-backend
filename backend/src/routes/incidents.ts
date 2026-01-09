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
 * @swagger
 * /api/incidents/upload-image:
 *   post:
 *     summary: Upload image for an incident
 *     tags: [Incidents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (max 5MB)
 *     responses:
 *       200:
 *         description: Upload successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 imageUrl:
 *                   type: string
 *                 filename:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/upload-image", upload.single("file"), incidentController.uploadImage);

/**
 * @swagger
 * /api/incidents/quick-report:
 *   post:
 *     summary: Quick report (create incident)
 *     tags: [Incidents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *               - type
 *               - location
 *               - timestamp
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 example: "/uploads/image-123.jpg"
 *               type:
 *                 type: string
 *                 example: "flood"
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 10.762622
 *                   lng:
 *                     type: number
 *                     example: 106.660172
 *                   address:
 *                     type: string
 *                     example: "TP. Hồ Chí Minh"
 *               description:
 *                 type: string
 *                 example: "Ngập nặng tại khu vực này"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Incident'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 * @swagger
 * /api/incidents/stats/overview:
 *   get:
 *     summary: Get incident statistics overview
 *     tags: [Incidents]
 *     responses:
 *       200:
 *         description: Statistics overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     pending:
 *                       type: integer
 *                       example: 45
 *                     resolved:
 *                       type: integer
 *                       example: 80
 *                     inProgress:
 *                       type: integer
 *                       example: 25
 */
router.get("/stats/overview", incidentController.getStatistics);

/**
 * @swagger
 * /api/incidents/recent:
 *   get:
 *     summary: Get recent incidents
 *     tags: [Incidents]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of recent incidents to return
 *     responses:
 *       200:
 *         description: List of recent incidents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Incident'
 *                 count:
 *                   type: integer
 */
router.get("/recent", incidentController.getRecentIncidents);

/**
 * @swagger
 * /api/incidents:
 *   get:
 *     summary: Get all incidents
 *     tags: [Incidents]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, resolved, rejected]
 *         description: Filter by status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by incident type
 *     responses:
 *       200:
 *         description: A list of incidents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Incident'
 *                 count:
 *                   type: integer
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/", incidentController.getAllIncidents);

/**
 * @swagger
 * /api/incidents/{id}:
 *   get:
 *     summary: Get incident by ID
 *     tags: [Incidents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Incident ID
 *     responses:
 *       200:
 *         description: Incident object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Incident'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", incidentController.getIncident);

/**
 * @swagger
 * /api/incidents/{id}/status:
 *   put:
 *     summary: Update incident status
 *     tags: [Incidents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Incident ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, resolved, rejected]
 *                 example: "resolved"
 *               note:
 *                 type: string
 *                 example: "Đã xử lý xong"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Incident'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/:id/status",
  [
    body("status").notEmpty(),
    body("note").optional().isString(),
  ],
  incidentController.updateIncidentStatus
);

export default router;
