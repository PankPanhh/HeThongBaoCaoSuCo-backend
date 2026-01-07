import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SystemConfig, SystemConfigResponse } from './setting.model';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private apiUrl = '/api/system/config'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  getSystemConfig(): Observable<SystemConfig> {
    // For development: return mock data
    // TODO: Replace with actual API call when backend is ready
    return this.getMockConfig().pipe(delay(500));

    // Production implementation:
    // return this.http.get<SystemConfigResponse>(this.apiUrl).pipe(
    //   map(response => response.data)
    // );
  }

  updateSystemConfig(formData: FormData): Observable<SystemConfigResponse> {
    // For development: simulate API call
    // TODO: Replace with actual API call when backend is ready
    return of({
      success: true,
      data: {} as SystemConfig,
      message: 'Cập nhật thành công',
    }).pipe(delay(1000));

    // Production implementation:
    // return this.http.put<SystemConfigResponse>(this.apiUrl, formData);
  }

  private getMockConfig(): Observable<SystemConfig> {
    const mockConfig: SystemConfig = {
      sla: {
        responseTime: 30,
        responseUnit: 'minutes',
        completionTime: 120,
        completionUnit: 'minutes',
      },
      notifications: {
        enabled: true,
        email: {
          enabled: true,
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUser: 'system@example.com',
          smtpPassword: '',
          fromEmail: 'noreply@example.com',
        },
        sms: {
          enabled: false,
          provider: 'Twilio',
          apiKey: '',
          apiSecret: '',
        },
        zalo: {
          enabled: false,
          oaId: '',
          appId: '',
          appSecret: '',
        },
      },
      ui: {
        systemName: 'Hệ thống báo cáo sự cố',
        theme: 'light',
        logoUrl: '',
      },
    };

    return of(mockConfig);
  }
}
