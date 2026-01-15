import apiFetch from './api';

export interface Alert {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  type: 'urgent' | 'news' | 'warning' | 'info';
  banner_image?: string;
  gallery?: string[];
  article_url?: string;
  priority: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Get active banners for Mini App users
 */
export async function getActiveBanners(limit = 10): Promise<Alert[]> {
  try {
    const response = await apiFetch(`/api/public/banners?limit=${limit}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Failed to fetch banners:', response.statusText);
      return [];
    }

    const result: ApiResponse<Alert[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return [];
  }
}

/**
 * Get banner detail by ID
 */
export async function getBannerDetail(alertId: string): Promise<Alert | null> {
  try {
    const response = await apiFetch(`/api/public/banners/${alertId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('Failed to fetch banner detail:', response.statusText);
      return null;
    }

    const result: ApiResponse<Alert> = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching banner detail:', error);
    return null;
  }
}

export interface UrlMetadata {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
}

export async function getUrlMetadata(url: string): Promise<UrlMetadata> {
  try {
    const response = await apiFetch(`/api/public/url-metadata?url=${encodeURIComponent(url)}`, {
        method: 'GET'
    });

    if (!response.ok) {
        return { title: '', description: '', image: '', siteName: new URL(url).hostname, url };
    }

    const result = await response.json();
    return result.data || { title: '', description: '', image: '', siteName: '', url };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return { title: '', description: '', image: '', siteName: '', url };
  }
}
