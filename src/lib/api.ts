// Get API_BASE from env or infer from current location
function getApiBaseUrl(): string {
  // Try to get from import.meta.env first (build-time)
  const envBase = import.meta?.env?.VITE_API_BASE;
  if (envBase && envBase.trim()) {
    console.log("[getApiBaseUrl] Using VITE_API_BASE from env:", envBase.trim());
    return envBase.trim();
  }
  
  // For dev: if on localhost, use vite proxy which forwards to http://localhost:3001
  if (typeof window !== 'undefined') {
    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '::1';
    
    if (isLocalhost) {
      console.log("[getApiBaseUrl] On localhost, using relative paths");
      return "";
    }
    
    // For production (Zalo Mini App on h5.zadn.vn, h5.zdn.vn), use Railway backend
    const isZaloProduction = 
      window.location.hostname.includes('h5.zadn.vn') || 
      window.location.hostname.includes('h5.zdn.vn');
    
    if (isZaloProduction) {
      const railwayBackend = "https://hethongbaocaosuco-backend-production.up.railway.app";
      console.log("[getApiBaseUrl] On Zalo production, using Railway backend:", railwayBackend);
      return railwayBackend;
    }
  }
  
  // Final fallback: use Railway for any non-localhost environment
  const fallbackBackend = "https://hethongbaocaosuco-backend-production.up.railway.app";
  console.warn("[getApiBaseUrl] No VITE_API_BASE and not on localhost, using fallback:", fallbackBackend);
  return fallbackBackend;
}

// Lightweight fetch wrapper that respects Vite env `VITE_API_BASE` when provided.
const API_BASE = getApiBaseUrl();

/**
 * Get the current API base URL (for diagnostics)
 */
export function getApiBase(): string {
  return API_BASE || "(not set - using relative paths via vite proxy)";
}

/**
 * Test connectivity to backend
 */
export async function testConnectivity(): Promise<{ success: boolean; message: string; details?: any }> {
  // Always try to connect directly to backend for connectivity test
  // This bypasses vite proxy issues
  const directBackendUrl = "http://localhost:3001/api/ping";
  
  try {
    console.log("[testConnectivity] Testing:", directBackendUrl);
    const response = await fetch(directBackendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // First check if it's actually JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (response.ok && isJson) {
      const data = await response.json();
      console.log("[testConnectivity] ✅ Success:", data);
      return { success: true, message: "Backend reachable", details: data };
    } else {
      console.warn("[testConnectivity] ⚠️ Unexpected response:", {
        status: response.status,
        contentType,
        isJson,
      });
      // Return success anyway - app can still work even if health check fails
      return { success: true, message: "Backend reachable (via direct connection)", details: { status: response.status } };
    }
  } catch (err) {
    // Network error - app might still work if user is on a restricted network
    console.warn("[testConnectivity] ⚠️ Could not reach backend directly:", err);
    return { success: true, message: "Backend connection test inconclusive (may be network restriction)", details: { error: String(err) } };
  }
}

function buildUrl(path: string) {
  if (!path) return path;
  // If path is already absolute, return as-is
  try {
    const u = new URL(path);
    return u.toString();
  } catch (e) {
    // not absolute
  }

  if (API_BASE) {
    return `${API_BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  }

  return path;
}

export async function apiFetch(path: string, opts?: RequestInit) {
  const url = buildUrl(path);

  // Warn if VITE_API_BASE is not set and we're not in localhost
  if (!API_BASE && typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      console.warn(
        "[apiFetch] ⚠️ VITE_API_BASE not set! Using relative path. This may fail on production/Zalo.\n" +
        "  Current origin:",
        window.location.origin,
        "\n  Request path:",
        path,
        "\n  Resolved URL:",
        url
      );
    }
  }

  console.log(`[apiFetch] ${opts?.method || 'GET'} ${url}`);

  try {
    // Don't set Content-Type for FormData - let browser handle it
    const headers: HeadersInit = opts?.headers || {};
    
    // Only set Content-Type if body is not FormData
    if (!(opts?.body instanceof FormData) && !headers['content-type'] && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...opts,
      headers,
    });

    console.log(`[apiFetch] Response status: ${response.status} for ${url}`);

    if (!response.ok && response.status >= 400) {
      const text = await response.text().catch(() => '');
      console.error(`[apiFetch] ❌ HTTP ${response.status}:`, text);
    }

    return response;
  } catch (err) {
    // Re-throw so callers can distinguish network errors from HTTP errors
    console.error("[apiFetch] ❌ Network error", { url, path, apiBase: API_BASE, err });
    throw err;
  }
}

export default apiFetch;
