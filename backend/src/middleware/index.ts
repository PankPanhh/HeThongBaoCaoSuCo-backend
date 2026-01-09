import { Request, Response, NextFunction } from "express";

/**
 * Error handler
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Special handling for CORS errors
  if (err.message === "CORS not allowed") {
    console.error(`[ERROR] CORS blocked request from: ${req.get('origin') || '(no origin)'}`);
    console.error(`[ERROR] Request path: ${req.method} ${req.path}`);
    console.error(`[ERROR] Headers:`, req.headers);
    
    return res.status(403).json({
      success: false,
      error: "CORS not allowed",
      message: "Your origin is not allowed. Contact admin to whitelist your domain.",
      timestamp: new Date().toISOString(),
    });
  }

  // General error logging
  console.error("[ERROR] Unhandled error:", err);
  console.error("[ERROR] Stack:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Request logger
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${req.method}] ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
