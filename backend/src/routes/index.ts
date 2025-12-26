import { Router } from "express";
import * as incidentController from "../controllers/incidentController.js";
import * as incidentService from "../services/incidentService.js";

const router = Router();

/**
 * Health check
 */
router.get("/health", incidentController.healthCheck);

/**
 * Audit logs
 */
router.get("/audit-logs", async (req, res) => {
  try {
    const { action } = req.query;
    const logs = await incidentService.getAuditLogs(action as string);

    res.json({
      success: true,
      data: logs,
      count: logs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed",
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
