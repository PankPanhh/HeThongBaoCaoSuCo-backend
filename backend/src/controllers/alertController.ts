import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as alertService from "../services/alertService.js";
import { CreateAlertRequest, UpdateAlertRequest } from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Admin endpoints

// Upload image for alert
export async function uploadAlertImage(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
        timestamp: new Date().toISOString(),
      });
    }

    // Validate file type
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: `Invalid file type. Allowed: JPEG, PNG, GIF, MP4, WebM`,
        timestamp: new Date().toISOString(),
      });
    }

    // Validate file size based on type
    const isVideo = req.file.mimetype.startsWith('video');
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB for images
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB for videos
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    const maxSizeLabel = isVideo ? '50MB' : '5MB';

    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        error: `File size exceeds ${maxSizeLabel} limit for ${isVideo ? 'video' : 'image'}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Create news directory if it doesn't exist
    // __dirname = backend/src/controllers or backend/dist/controllers
    // Go up 3 levels to reach project root: controllers -> dist -> backend -> project root
    const WORKSPACE_ROOT = path.join(__dirname, "..", "..", "..");  // controllers -> dist/src -> backend -> project root
    const NEWS_UPLOAD_DIR = path.join(WORKSPACE_ROOT, "public", "static", "news");
    
    console.log(`[uploadAlertImage] __dirname: ${__dirname}`);
    console.log(`[uploadAlertImage] WORKSPACE_ROOT: ${WORKSPACE_ROOT}`);
    console.log(`[uploadAlertImage] NEWS_UPLOAD_DIR: ${NEWS_UPLOAD_DIR}`);
    
    if (!fs.existsSync(NEWS_UPLOAD_DIR)) {
      console.log(`[uploadAlertImage] Creating directory: ${NEWS_UPLOAD_DIR}`);
      fs.mkdirSync(NEWS_UPLOAD_DIR, { recursive: true });
    } else {
      console.log(`[uploadAlertImage] Directory exists: ${NEWS_UPLOAD_DIR}`);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(req.file.originalname);
    const filename = `${timestamp}-${randomStr}${ext}`;
    const filepath = path.join(NEWS_UPLOAD_DIR, filename);

    // Save file
    fs.writeFileSync(filepath, req.file.buffer);
    
    // Verify file was saved
    const fileExists = fs.existsSync(filepath);
    console.log(`[uploadAlertImage] File saved to: ${filepath}`);
    console.log(`[uploadAlertImage] File exists: ${fileExists}`);
    console.log(`[uploadAlertImage] File size: ${fs.statSync(filepath).size} bytes`);

    // Return full URL with backend origin
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:3001';
    const imageUrl = `${protocol}://${host}/static/news/${filename}`;

    console.log(`[uploadAlertImage] File accessible at: ${imageUrl}`);

    res.json({
      success: true,
      data: {
        imageUrl: imageUrl,
        filename: filename,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Get all alerts (admin)
export async function getAllAlerts(req: Request, res: Response) {
  try {
    const { type, is_active } = req.query;
    
    const filters: any = {};
    if (type) filters.type = type;
    if (is_active !== undefined) filters.is_active = is_active === "true";

    const alerts = await alertService.getAllAlerts(filters);

    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting alerts:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Get deleted alerts (trash) - admin
export async function getDeletedAlerts(req: Request, res: Response) {
  try {
    const alerts = await alertService.getDeletedAlerts();
    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting deleted alerts:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Restore alert from trash - admin
export async function restoreAlert(req: Request, res: Response) {
  try {
    const { alertId } = req.params;
    const userId = req.body.userId;
    
    const alert = await alertService.restoreAlert(alertId, userId);
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
        timestamp: new Date().toISOString(),
      });
    }
    
    res.json({
      success: true,
      data: alert,
      message: "Alert restored successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error restoring alert:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Permanently delete alert - admin
export async function permanentDeleteAlert(req: Request, res: Response) {
  try {
    const { alertId } = req.params;
    const userId = req.body.userId;
    
    const success = await alertService.permanentDeleteAlert(alertId, userId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
        timestamp: new Date().toISOString(),
      });
    }
    
    res.json({
      success: true,
      message: "Alert permanently deleted from database",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error permanently deleting alert:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}


// Get alert by ID (admin)
export async function getAlertById(req: Request, res: Response) {
  try {
    const { alertId } = req.params;
    const alert = await alertService.getAlertById(alertId);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: alert,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting alert:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Create new alert (admin)
export async function createAlert(req: Request, res: Response) {
  try {
    const data: CreateAlertRequest = req.body;

    // Validation
    if (!data.title || !data.content || !data.type) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: title, content, type",
        timestamp: new Date().toISOString(),
      });
    }

    if (!data.start_time || !data.end_time) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: start_time, end_time",
        timestamp: new Date().toISOString(),
      });
    }

    // Validate date range
    const startDate = new Date(data.start_time);
    const endDate = new Date(data.end_time);
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        error: "end_time must be after start_time",
        timestamp: new Date().toISOString(),
      });
    }

    const alert = await alertService.createAlert(data);

    res.status(201).json({
      success: true,
      data: alert,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Update alert (admin)
export async function updateAlert(req: Request, res: Response) {
  try {
    const { alertId } = req.params;
    const data: UpdateAlertRequest = req.body;
    const userId = req.body.userId; // from auth middleware if implemented

    // Validate date range if both dates provided
    if (data.start_time && data.end_time) {
      const startDate = new Date(data.start_time);
      const endDate = new Date(data.end_time);
      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          error: "end_time must be after start_time",
          timestamp: new Date().toISOString(),
        });
      }
    }

    const alert = await alertService.updateAlert(alertId, data, userId);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: alert,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating alert:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Toggle alert status (admin)
export async function toggleAlertStatus(req: Request, res: Response) {
  try {
    const { alertId } = req.params;
    const { is_active } = req.body;
    const userId = req.body.userId;

    console.log('[toggleAlertStatus] Request:', { alertId, is_active, userId });

    if (is_active === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: is_active",
        timestamp: new Date().toISOString(),
      });
    }

    const alert = await alertService.toggleAlertStatus(alertId, is_active, userId);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: alert,
      message: `Alert ${is_active ? "activated" : "deactivated"} successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error toggling alert status:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Delete alert (admin) - soft delete
export async function deleteAlert(req: Request, res: Response) {
  try {
    const { alertId } = req.params;
    const userId = req.body.userId;

    const success = await alertService.deleteAlert(alertId, userId);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: "Alert deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Get alerts statistics (admin)
export async function getAlertsStatistics(req: Request, res: Response) {
  try {
    const stats = await alertService.getAlertsStatistics();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting alerts statistics:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Public endpoints

// Get active banners for Mini App users
export async function getActiveBanners(req: Request, res: Response) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const banners = await alertService.getActiveBanners(limit);

    res.json({
      success: true,
      data: banners,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting active banners:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Get single banner detail (public)
export async function getBannerDetail(req: Request, res: Response) {
  try {
    const { alertId } = req.params;
    const alert = await alertService.getAlertById(alertId);

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: "Banner not found",
        timestamp: new Date().toISOString(),
      });
    }

    // Only return if it's active and within time range
    const now = new Date().toISOString();
    if (!alert.is_active || alert.start_time > now || alert.end_time < now) {
      return res.status(404).json({
        success: false,
        error: "Banner not available",
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: alert,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting banner detail:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}

// Get URL metadata for link preview
export async function getUrlMetadata(req: Request, res: Response) {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: "Missing or invalid URL" });
    }

    // Basic validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ success: false, error: "Invalid URL format" });
    }

    const response = await fetch(url, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IncidentBot/1.0)' } 
    });
    
    if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Simple regex extraction
    const getMeta = (prop: string) => {
        const match = html.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`, 'i')) 
                   || html.match(new RegExp(`<meta name="${prop}" content="([^"]*)"`, 'i'));
        return match ? match[1] : null;
    };
    
    // Title fallback
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const title = getMeta('og:title') || (titleMatch ? titleMatch[1] : '') || '';
    
    const description = getMeta('og:description') || getMeta('description') || '';
    const image = getMeta('og:image') || '';
    const siteName = getMeta('og:site_name') || new URL(url).hostname;

    res.json({
      success: true,
      data: { title, description, image, siteName, url }
    });

  } catch (error) {
    console.error('Metadata fetch error:', error);
    // Return empty data instead of 500 so UI can just show link
    res.json({
      success: true,
      data: { 
        title: "", 
        description: "", 
        image: "", 
        siteName: req.query.url ? new URL(req.query.url as string).hostname : ""
      }
    });
  }
}
