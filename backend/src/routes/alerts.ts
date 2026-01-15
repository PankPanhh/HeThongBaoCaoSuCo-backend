import { Router } from "express";
import multer from "multer";
import * as alertController from "../controllers/alertController.js";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for videos
  },
});

// Admin routes - Alert Management
/**
 * @swagger
 * /api/admin/alerts/upload-image:
 *   post:
 *     summary: Upload image for alert
 *     tags: [Admin - Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file or no file uploaded
 */
router.post("/admin/alerts/upload-image", upload.single("file"), alertController.uploadAlertImage);

/**
 * @swagger
 * /api/admin/alerts:
 *   get:
 *     summary: Get all alerts (admin)
 *     tags: [Admin - Alerts]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [urgent, news, warning, info]
 *         description: Filter by alert type
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of alerts
 */
router.get("/admin/alerts", alertController.getAllAlerts);

/**
 * @swagger
 * /api/admin/alerts/statistics:
 *   get:
 *     summary: Get alerts statistics
 *     tags: [Admin - Alerts]
 *     responses:
 *       200:
 *         description: Alerts statistics
 */
router.get("/admin/alerts/statistics", alertController.getAlertsStatistics);

/**
 * @swagger
 * /api/admin/alerts/trash:
 *   get:
 *     summary: Get deleted alerts (trash)
 *     tags: [Admin - Alerts]
 *     responses:
 *       200:
 *         description: List of deleted alerts
 */
router.get("/admin/alerts/trash", alertController.getDeletedAlerts);

/**
 * @swagger
 * /api/admin/alerts/{alertId}:
 *   get:
 *     summary: Get alert by ID
 *     tags: [Admin - Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alert details
 *       404:
 *         description: Alert not found
 */
router.get("/admin/alerts/:alertId", alertController.getAlertById);

/**
 * @swagger
 * /api/admin/alerts/{alertId}/restore:
 *   post:
 *     summary: Restore deleted alert from trash
 *     tags: [Admin - Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alert restored successfully
 *       404:
 *         description: Alert not found
 */
router.post("/admin/alerts/:alertId/restore", alertController.restoreAlert);

/**
 * @swagger
 * /api/admin/alerts/{alertId}/permanent:
 *   delete:
 *     summary: Permanently delete alert from database
 *     tags: [Admin - Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alert permanently deleted
 *       404:
 *         description: Alert not found
 */
router.delete("/admin/alerts/:alertId/permanent", alertController.permanentDeleteAlert);


/**
 * @swagger
 * /api/admin/alerts:
 *   post:
 *     summary: Create new alert
 *     tags: [Admin - Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - type
 *               - start_time
 *               - end_time
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [urgent, news, warning, info]
 *               banner_image:
 *                 type: string
 *               priority:
 *                 type: number
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               is_active:
 *                 type: boolean
 *               created_by:
 *                 type: string
 *     responses:
 *       201:
 *         description: Alert created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/admin/alerts", alertController.createAlert);

/**
 * @swagger
 * /api/admin/alerts/{alertId}:
 *   put:
 *     summary: Update alert
 *     tags: [Admin - Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Alert updated successfully
 *       404:
 *         description: Alert not found
 */
router.put("/admin/alerts/:alertId", alertController.updateAlert);

/**
 * @swagger
 * /api/admin/alerts/{alertId}/status:
 *   patch:
 *     summary: Toggle alert status
 *     tags: [Admin - Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - is_active
 *             properties:
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Alert status updated
 *       404:
 *         description: Alert not found
 */
router.patch("/admin/alerts/:alertId/status", alertController.toggleAlertStatus);

/**
 * @swagger
 * /api/admin/alerts/{alertId}:
 *   delete:
 *     summary: Delete alert (soft delete)
 *     tags: [Admin - Alerts]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Alert deleted successfully
 *       404:
 *         description: Alert not found
 */
router.delete("/admin/alerts/:alertId", alertController.deleteAlert);

// Public routes - Banners for Mini App
/**
 * @swagger
 * /api/public/banners:
 *   get:
 *     summary: Get active banners for Mini App
 *     tags: [Public - Banners]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         description: Maximum number of banners to return
 *     responses:
 *       200:
 *         description: List of active banners
 */
router.get("/public/banners", alertController.getActiveBanners);

/**
 * @swagger
 * /api/public/banners/{alertId}:
 *   get:
 *     summary: Get banner detail
 *     tags: [Public - Banners]
 *     parameters:
 *       - in: path
 *         name: alertId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Banner details
 *       404:
 *         description: Banner not found or not available
 */
router.get("/public/banners/:alertId", alertController.getBannerDetail);

/**
 * @swagger
 * /api/public/url-metadata:
 *   get:
 *     summary: Get metadata for URL preview
 *     tags: [Public - Banners]
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL metadata
 */
router.get("/public/url-metadata", alertController.getUrlMetadata);

export default router;
