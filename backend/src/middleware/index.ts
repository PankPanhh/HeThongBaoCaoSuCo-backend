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
  console.error("Error:", err);

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
