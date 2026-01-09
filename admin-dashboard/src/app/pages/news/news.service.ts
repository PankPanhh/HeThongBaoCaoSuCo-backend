import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Alert } from './news.model';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private readonly API_BASE = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // Get all alerts
  getAllAlerts(filters?: {
    type?: string;
    is_active?: boolean;
  }): Observable<Alert[]> {
    let params = new HttpParams();
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.is_active !== undefined)
      params = params.set('is_active', filters.is_active.toString());

    return this.http
      .get<ApiResponse<Alert[]>>(`${this.API_BASE}/admin/alerts`, { params })
      .pipe(map((res) => res.data || []));
  }

  // Get alert by ID
  getAlertById(alertId: string): Observable<Alert | null> {
    return this.http
      .get<ApiResponse<Alert>>(`${this.API_BASE}/admin/alerts/${alertId}`)
      .pipe(map((res) => res.data || null));
  }

  // Create alert
  createAlert(alert: Partial<Alert>): Observable<Alert> {
    return this.http
      .post<ApiResponse<Alert>>(`${this.API_BASE}/admin/alerts`, alert)
      .pipe(map((res) => res.data!));
  }

  // Update alert
  updateAlert(alertId: string, alert: Partial<Alert>): Observable<Alert> {
    return this.http
      .put<ApiResponse<Alert>>(
        `${this.API_BASE}/admin/alerts/${alertId}`,
        alert
      )
      .pipe(map((res) => res.data!));
  }

  // Toggle alert status
  toggleAlertStatus(
    alertId: string,
    is_active: boolean
  ): Observable<Alert> {
    return this.http
      .patch<ApiResponse<Alert>>(
        `${this.API_BASE}/admin/alerts/${alertId}/status`,
        { is_active }
      )
      .pipe(map((res) => res.data!));
  }

  // Delete alert (soft delete - move to trash)
  deleteAlert(alertId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.API_BASE}/admin/alerts/${alertId}`)
      .pipe(map(() => undefined));
  }

  // Get deleted alerts (trash)
  getDeletedAlerts(): Observable<Alert[]> {
    return this.http
      .get<ApiResponse<Alert[]>>(`${this.API_BASE}/admin/alerts/trash`)
      .pipe(map((res) => res.data || []));
  }

  // Restore alert from trash
  restoreAlert(alertId: string): Observable<Alert> {
    return this.http
      .post<ApiResponse<Alert>>(
        `${this.API_BASE}/admin/alerts/${alertId}/restore`,
        {}
      )
      .pipe(map((res) => res.data!));
  }

  // Permanently delete alert (hard delete)
  permanentDeleteAlert(alertId: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(
        `${this.API_BASE}/admin/alerts/${alertId}/permanent`
      )
      .pipe(map(() => undefined));
  }

  // Get statistics
  getStatistics(): Observable<{
    total: number;
    active: number;
    expired: number;
    upcoming: number;
  }> {
    return this.http
      .get<
        ApiResponse<{
          total: number;
          active: number;
          expired: number;
          upcoming: number;
        }>
      >(`${this.API_BASE}/admin/alerts/statistics`)
      .pipe(
        map((res) => res.data || { total: 0, active: 0, expired: 0, upcoming: 0 })
      );
  }
}
