import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as incidentService from "../services/incidentService.js";
import * as fileService from "../services/fileService.js";
import { CreateQuickReportRequest, IncidentStatus } from "../types/index.js";

/**
 * Upload image cho incident
 * POST /api/incidents/upload-image
 */
export async function uploadImage(req: Request, res: Response) {
  try {
    console.log("[uploadImage] Request received", {
      method: req.method,
      contentType: req.get("content-type"),
      hasFile: !!req.file,
      fileSize: req.file?.size,
      fileBuffer: req.file?.buffer?.length,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn("[uploadImage] Validation failed:", errors.array());
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
        timestamp: new Date().toISOString(),
      });
    }

    if (!req.file) {
      console.warn("[uploadImage] No file in request");
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        timestamp: new Date().toISOString(),
      });
    }

    console.log("[uploadImage] File received", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bufferLength: req.file.buffer?.length,
    });

    // Validate image
    const validation = fileService.validateImageFile(
      req.file.buffer,
      req.file.mimetype
    );

    if (!validation.valid) {
      console.warn("[uploadImage] Image validation failed:", validation.error);
      return res.status(400).json({
        success: false,
        error: validation.error,
        timestamp: new Date().toISOString(),
      });
    }

    // Save file into public/static/incidents so frontend can reference it as /static/incidents/...
    const { imageUrl, filename, size } = await fileService.saveToPublicStaticIncidents(
      req.file.buffer,
      req.file.originalname
    );

    console.log(`✅ [uploadImage] Image uploaded: ${filename} (${size} bytes) -> ${imageUrl}`);

    res.json({
      success: true,
      data: {
        imageUrl,
        size,
        mimeType: req.file.mimetype,
        filename,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[uploadImage] ❌ Error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Tạo quick report incident
 * POST /api/incidents/quick-report
 */
export async function createQuickReport(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors.array(),
        timestamp: new Date().toISOString(),
      });
    }

    const body: CreateQuickReportRequest = req.body;

    // Auto-determine priority
    let priority = "MEDIUM";
    const typeStr = body.type.toLowerCase();
    if (typeStr.includes("dien") || typeStr.includes("an-ninh")) {
      priority = "HIGH";
    } else if (typeStr.includes("khac")) {
      priority = "LOW";
    }

    // Create incident
    const incident = await incidentService.createIncident({
      type: body.type,
      location: body.location,
      description: body.description,
      media: body.imageUrl ? [body.imageUrl] : [],
      source: body.source || "ZALO_MINI_APP_QUICK",
      priority: body.priority || (priority as any),
      status: "Đang xử lý",
      userId: body.userId,
    });

    // Normalize ID (service may return `_id` or `id`)
    const createdId = (incident && (incident.id || (incident._id && incident._id.toString && incident._id.toString()) || incident._id)) || null;
    if (createdId) {
      (incident as any).id = createdId;
    }

    console.log(`✅ Incident created: ${createdId}`);

    res.status(201).json({
      success: true,
      data: incident,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Create report error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Lấy incident theo ID
 * GET /api/incidents/:id
 */
export async function getIncident(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const incident = await incidentService.getIncident(id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        error: "Incident not found",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: incident,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get incident error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Lấy tất cả incidents với filter
 * GET /api/incidents?status=NEW&type=dien
 */
export async function getAllIncidents(req: Request, res: Response) {
  try {
    const { status, type, source } = req.query;

    const incidents = await incidentService.getAllIncidents({
      status: status as any,
      type: type as string,
      source: source as string,
    });

    // Pagination support (optional query params: page, limit)
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const limit = Math.max(1, parseInt((req.query.limit as string) || "50", 10));
    const start = (page - 1) * limit;
    const paged = Array.isArray(incidents) ? incidents.slice(start, start + limit) : [];

    res.json({
      success: true,
      data: paged,
      count: Array.isArray(incidents) ? incidents.length : 0,
      page,
      limit,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get incidents error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Lấy sự cố mới nhất cho admin dashboard
 * GET /api/incidents/recent?limit=10
 */
export async function getRecentIncidents(req: Request, res: Response) {
  try {
    const limit = Math.max(1, Math.min(50, parseInt((req.query.limit as string) || "10", 10)));

    const incidents = await incidentService.getAllIncidents({});

    // Get the most recent incidents (already sorted by createdAt desc in service)
    const recent = Array.isArray(incidents) ? incidents.slice(0, limit) : [];
    
    // Format each incident for display (ensure description and imageUrl are set)
    const formatted = recent.map((inc: any) => incidentService.formatIncidentForDisplay(inc));

    console.log(`✅ [getRecentIncidents] Retrieved ${formatted.length} recent incidents`);

    res.json({
      success: true,
      data: formatted,
      count: formatted.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get recent incidents error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to get recent incidents",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Cập nhật trạng thái
 * PUT /api/incidents/:id/status
 */
export async function updateIncidentStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Status required",
        timestamp: new Date().toISOString(),
      });
    }

    // Basic validation: ensure status is a non-empty string
    if (typeof status !== "string" || !status.trim()) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
        timestamp: new Date().toISOString(),
      });
    }

    const incident = await incidentService.updateIncidentStatus(id, status as IncidentStatus, note);

    res.json({
      success: true,
      data: incident,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Thống kê
 * GET /api/incidents/stats/overview
 */
export async function getStatistics(req: Request, res: Response) {
  try {
    const stats = await incidentService.getStatistics();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed",
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Health check
 */
export async function healthCheck(req: Request, res: Response) {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
}
