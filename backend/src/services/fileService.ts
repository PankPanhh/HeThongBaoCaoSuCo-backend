import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "5242880"); // 5MB
// Use plural `incidents` folder so frontend references match `/static/incidents/...`
// Path to workspace root public/static/incidents (3 levels up from backend/src/services/)
const PUBLIC_STATIC_INCIDENTS = path.join(__dirname, "..", "..", "..", "public", "static", "incidents");

/**
 * Tạo thư mục upload nếu chưa tồn tại
 */
export async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log(`📁 Upload directory ready: ${UPLOAD_DIR}`);
  } catch (error) {
    console.error("Failed to create upload directory:", error);
  }
}

/**
 * Lưu file và trả về URL
 */
export async function saveUploadedFile(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<{ imageUrl: string; filename: string; size: number }> {
  // Validate size
  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
    );
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const ext = path.extname(originalFilename);
  const filename = `incident-${timestamp}-${randomStr}${ext}`;

  // Save file
  const filePath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(filePath, fileBuffer);

  // Return public URL
  const imageUrl = `${process.env.CDN_BASE_URL || "http://localhost:3000"}/uploads/${filename}`;

  return {
    imageUrl,
    filename,
    size: fileBuffer.length,
  };
}

/**
 * Save an uploaded image into public/static/incidents so it's available
 * as a static asset under `/static/incidents/...`.
 */
export async function saveToPublicStaticIncidents(
  fileBuffer: Buffer,
  originalFilename: string
): Promise<{ imageUrl: string; filename: string; size: number }> {
  try {
    await fs.mkdir(PUBLIC_STATIC_INCIDENTS, { recursive: true });

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const ext = path.extname(originalFilename) || ".jpg";
    const filename = `incident-${timestamp}-${randomStr}${ext}`;
    const filePath = path.join(PUBLIC_STATIC_INCIDENTS, filename);

    await fs.writeFile(filePath, fileBuffer);

    const imageUrl = `/static/incidents/${filename}`; // relative URL served by web server (plural folder)

    return { imageUrl, filename, size: fileBuffer.length };
  } catch (err) {
    console.error("Failed to save to public static incidents:", err);
    throw err;
  }
}

/**
 * Validate image file
 */
export function validateImageFile(
  buffer: Buffer,
  mimeType: string
): { valid: boolean; error?: string } {
  const validMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validMimeTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid type. Allowed: ${validMimeTypes.join(", ")}`,
    };
  }

  if (buffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  if (buffer.length < 1000) {
    return {
      valid: false,
      error: "Image too small or empty",
    };
  }

  return { valid: true };
}
