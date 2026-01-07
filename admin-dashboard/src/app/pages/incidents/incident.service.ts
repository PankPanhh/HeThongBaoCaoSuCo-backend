import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Incident, IncidentStatus, IncidentPriority } from './incident.model';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private apiUrl = 'http://localhost:3001/api/incidents'; // Backend API URL

  constructor(private http: HttpClient) {}
  private mockIncidents: Incident[] = [
    {
      id: 'INC-001',
      title: 'Rò rỉ nước tại tầng 3',
      description: 'Phát hiện điểm rò rỉ nước ở khu vực hành lang chính',
      status: IncidentStatus.PROCESSING,
      priority: IncidentPriority.HIGH,
      area: 'Tầng 3',
      type: 'Rò rỉ nước',
      reportedBy: 'Nguyễn Văn A',
      reportedDate: new Date('2026-01-02T08:30:00'),
      assignedTeam: 'Đội kỹ thuật số 1',
      lastUpdated: new Date('2026-01-02T09:15:00'),
      notes: ['Đã xác định vị trí', 'Chờ công cụ sửa chữa'],
    },
    {
      id: 'INC-002',
      title: 'Đèn hỏng khu vực sân sau',
      description: 'Nhiều bóng đèn không hoạt động tại sân sau',
      status: IncidentStatus.NEW,
      priority: IncidentPriority.MEDIUM,
      area: 'Sân sau',
      type: 'Điện',
      reportedBy: 'Trần Thị B',
      reportedDate: new Date('2026-01-02T10:00:00'),
      lastUpdated: new Date('2026-01-02T10:00:00'),
    },
    {
      id: 'INC-003',
      title: 'Thang máy kẹt tại tầng 5',
      description: 'Thang máy số 2 ngừng hoạt động, có người bị kẹt',
      status: IncidentStatus.RESOLVED,
      priority: IncidentPriority.URGENT,
      area: 'Tầng 5',
      type: 'Thang máy',
      reportedBy: 'Lê Văn C',
      reportedDate: new Date('2026-01-01T14:20:00'),
      assignedTeam: 'Đội bảo trì thang máy',
      lastUpdated: new Date('2026-01-01T15:45:00'),
      notes: [
        'Đã giải cứu người bị kẹt',
        'Đã sửa chữa xong',
        'Kiểm tra an toàn hoàn tất',
      ],
    },
    {
      id: 'INC-004',
      title: 'Tắc cống khu vực nhà xe',
      description: 'Nước không thoát được sau mưa',
      status: IncidentStatus.ASSIGNED,
      priority: IncidentPriority.HIGH,
      area: 'Nhà xe',
      type: 'Hệ thống thoát nước',
      reportedBy: 'Phạm Thị D',
      reportedDate: new Date('2026-01-02T07:15:00'),
      assignedTeam: 'Đội vệ sinh',
      lastUpdated: new Date('2026-01-02T07:30:00'),
    },
    {
      id: 'INC-005',
      title: 'Điều hòa hỏng phòng họp A',
      description: 'Điều hòa không làm lạnh',
      status: IncidentStatus.PROCESSING,
      priority: IncidentPriority.MEDIUM,
      area: 'Tầng 1 - Phòng họp A',
      type: 'Điều hòa',
      reportedBy: 'Hoàng Văn E',
      reportedDate: new Date('2026-01-01T16:00:00'),
      assignedTeam: 'Đội kỹ thuật số 2',
      lastUpdated: new Date('2026-01-02T08:00:00'),
      notes: ['Đang kiểm tra hệ thống'],
    },
    {
      id: 'INC-006',
      title: 'Cửa kính rạn nứt',
      description: 'Phát hiện vết nứt lớn trên cửa kính chính',
      status: IncidentStatus.NEW,
      priority: IncidentPriority.HIGH,
      area: 'Tầng 1 - Lối vào chính',
      type: 'Cơ sở vật chất',
      reportedBy: 'Vũ Thị F',
      reportedDate: new Date('2026-01-02T09:30:00'),
      lastUpdated: new Date('2026-01-02T09:30:00'),
    },
    {
      id: 'INC-007',
      title: 'Wifi không kết nối được',
      description: 'Toàn bộ tầng 2 không thể kết nối wifi',
      status: IncidentStatus.REOPENED,
      priority: IncidentPriority.HIGH,
      area: 'Tầng 2',
      type: 'Hệ thống IT',
      reportedBy: 'Đỗ Văn G',
      reportedDate: new Date('2025-12-30T11:00:00'),
      assignedTeam: 'Đội IT',
      lastUpdated: new Date('2026-01-02T08:00:00'),
      notes: [
        'Đã sửa lần 1 nhưng vẫn gặp sự cố',
        'Đang điều tra nguyên nhân gốc rễ',
      ],
    },
    {
      id: 'INC-008',
      title: 'Bồn cầu bị tắc',
      description: 'Bồn cầu nam tầng 4 bị tắc nghiêm trọng',
      status: IncidentStatus.PROCESSING,
      priority: IncidentPriority.MEDIUM,
      area: 'Tầng 4 - WC Nam',
      type: 'Vệ sinh',
      reportedBy: 'Mai Văn H',
      reportedDate: new Date('2026-01-02T09:00:00'),
      assignedTeam: 'Đội vệ sinh',
      lastUpdated: new Date('2026-01-02T09:45:00'),
    },
    {
      id: 'INC-009',
      title: 'Camera an ninh không hoạt động',
      description: '3 camera tại khu A không ghi hình',
      status: IncidentStatus.ASSIGNED,
      priority: IncidentPriority.URGENT,
      area: 'Khu A',
      type: 'An ninh',
      reportedBy: 'Bùi Thị I',
      reportedDate: new Date('2026-01-02T06:30:00'),
      assignedTeam: 'Đội an ninh',
      lastUpdated: new Date('2026-01-02T07:00:00'),
    },
    {
      id: 'INC-010',
      title: 'Sơn tường bong tróc',
      description: 'Tường hành lang tầng 3 bong tróc nhiều',
      status: IncidentStatus.NEW,
      priority: IncidentPriority.LOW,
      area: 'Tầng 3',
      type: 'Cơ sở vật chất',
      reportedBy: 'Lý Văn K',
      reportedDate: new Date('2026-01-02T10:30:00'),
      lastUpdated: new Date('2026-01-02T10:30:00'),
    },
    {
      id: 'INC-011',
      title: 'Mất điện cục bộ',
      description: 'Khu vực văn phòng B mất điện hoàn toàn',
      status: IncidentStatus.RESOLVED,
      priority: IncidentPriority.URGENT,
      area: 'Khu B - Văn phòng',
      type: 'Điện',
      reportedBy: 'Trương Thị L',
      reportedDate: new Date('2026-01-01T13:00:00'),
      assignedTeam: 'Đội kỹ thuật số 1',
      lastUpdated: new Date('2026-01-01T14:30:00'),
      notes: ['Đã khôi phục điện', 'Nguyên nhân: CB tự động nhảy'],
    },
    {
      id: 'INC-012',
      title: 'Chuột xuất hiện tại căng tin',
      description: 'Phát hiện chuột trong khu vực căng tin',
      status: IncidentStatus.PROCESSING,
      priority: IncidentPriority.HIGH,
      area: 'Tầng 1 - Căng tin',
      type: 'Vệ sinh môi trường',
      reportedBy: 'Ngô Văn M',
      reportedDate: new Date('2026-01-02T08:00:00'),
      assignedTeam: 'Đội diệt côn trùng',
      lastUpdated: new Date('2026-01-02T10:00:00'),
      notes: ['Đã đặt bẫy', 'Sẽ khử trùng toàn bộ khu vực'],
    },
  ];

  getAllIncidents(): Observable<Incident[]> {
    return this.http.get<{ success: boolean; data: any[]; count: number }>(`${this.apiUrl}`)
      .pipe(
        map(response => {
          if (response.success && Array.isArray(response.data)) {
            return response.data.map(inc => this.mapBackendToFrontend(inc));
          }
          return [];
        }),
        catchError(error => {
          console.error('Error fetching incidents:', error);
          // Return mock data as fallback
          return of([...this.mockIncidents]);
        })
      );
  }

  getIncidentsByStatus(status: IncidentStatus): Observable<Incident[]> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}?status=${status}`)
      .pipe(
        map(response => {
          if (response.success && Array.isArray(response.data)) {
            return response.data.map(inc => this.mapBackendToFrontend(inc));
          }
          return [];
        }),
        catchError(error => {
          console.error('Error fetching incidents by status:', error);
          return of(this.mockIncidents.filter((inc) => inc.status === status));
        })
      );
  }

  getIncidentsByArea(area: string): Observable<Incident[]> {
    return this.getAllIncidents().pipe(
      map(incidents => incidents.filter((inc) => inc.area.includes(area)))
    );
  }

  /**
   * Map backend incident data to frontend Incident model
   */
  private mapBackendToFrontend(backendInc: any): Incident {
    return {
      id: backendInc.id || backendInc._id?.toString() || '',
      title: backendInc.type || 'Sự cố',
      description: backendInc.description || '',
      status: this.mapBackendStatus(backendInc.status),
      priority: this.mapBackendPriority(backendInc.priority),
      area: backendInc.location || 'Chưa xác định',
      type: backendInc.type || 'Khác',
      reportedBy: backendInc.userId || 'Ẩn danh',
      reportedDate: backendInc.createdAt ? new Date(backendInc.createdAt) : new Date(),
      assignedTeam: backendInc.assignedTeam,
      lastUpdated: backendInc.updatedAt ? new Date(backendInc.updatedAt) : new Date(),
      images: Array.isArray(backendInc.media) ? backendInc.media : [],
      notes: Array.isArray(backendInc.notes) ? backendInc.notes : []
    };
  }

  /**
   * Map backend status to frontend IncidentStatus enum
   */
  private mapBackendStatus(status: string): IncidentStatus {
    const statusMap: Record<string, IncidentStatus> = {
      'NEW': IncidentStatus.NEW,
      'Mới': IncidentStatus.NEW,
      'ASSIGNED': IncidentStatus.ASSIGNED,
      'Đã gửi': IncidentStatus.ASSIGNED,
      'PROCESSING': IncidentStatus.PROCESSING,
      'Đang xử lý': IncidentStatus.PROCESSING,
      'RESOLVED': IncidentStatus.RESOLVED,
      'Đã giải quyết': IncidentStatus.RESOLVED,
      'REOPENED': IncidentStatus.REOPENED,
      'Mở lại': IncidentStatus.REOPENED
    };
    return statusMap[status] || IncidentStatus.NEW;
  }

  /**
   * Map backend priority to frontend IncidentPriority enum
   */
  private mapBackendPriority(priority: string): IncidentPriority {
    const priorityMap: Record<string, IncidentPriority> = {
      'LOW': IncidentPriority.LOW,
      'Thấp': IncidentPriority.LOW,
      'MEDIUM': IncidentPriority.MEDIUM,
      'Trung bình': IncidentPriority.MEDIUM,
      'HIGH': IncidentPriority.HIGH,
      'Cao': IncidentPriority.HIGH,
      'URGENT': IncidentPriority.URGENT,
      'Khẩn cấp': IncidentPriority.URGENT
    };
    return priorityMap[priority] || IncidentPriority.MEDIUM;
  }

  getIncidentStatsByStatus(): {
    status: IncidentStatus;
    count: number;
    label: string;
  }[] {
    const statuses = Object.values(IncidentStatus);
    return statuses.map((status) => ({
      status,
      count: this.mockIncidents.filter((inc) => inc.status === status).length,
      label: this.getStatusLabel(status),
    }));
  }

  getIncidentStatsByArea(): { area: string; count: number }[] {
    const areaMap = new Map<string, number>();
    this.mockIncidents.forEach((inc) => {
      const baseArea = inc.area.split(' - ')[0]; // Group by main area
      areaMap.set(baseArea, (areaMap.get(baseArea) || 0) + 1);
    });

    return Array.from(areaMap.entries())
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getStatusLabel(status: IncidentStatus): string {
    const labels: Record<IncidentStatus, string> = {
      [IncidentStatus.NEW]: 'Mới',
      [IncidentStatus.ASSIGNED]: 'Đã gửi',
      [IncidentStatus.PROCESSING]: 'Đang xử lý',
      [IncidentStatus.RESOLVED]: 'Đã giải quyết',
      [IncidentStatus.REOPENED]: 'Mở lại',
    };
    return labels[status];
  }

  /**
   * Lấy sự cố mới nhất từ backend API
   */
  getRecentIncidents(limit: number = 10): Observable<any[]> {
    return this.http.get<{success: boolean, data: any[], count: number}>(
      `${this.apiUrl}/recent?limit=${limit}`
    ).pipe(
      map(response => response.data || []),
      catchError(error => {
        console.error('Error fetching recent incidents:', error);
        return of([]); // Return empty array on error
      })
    );
  }
}
