import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuditEntry } from './audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private mock: AuditEntry[] = [
    {
      id: '1',
      timestamp: '2025-12-11 14:32:10',
      userName: 'Nguyễn Minh Quân',
      userId: 'user_034',
      action: 'Đổi trạng thái sự cố',
      target: 'Sự cố #INC023',
      oldValue: 'Chờ xử lý',
      newValue: 'Đang xử lý',
      ip: '203.0.113.12',
      device: 'Web',
      notes: 'Chuyển sang xử lý theo team BH'
    },
    {
      id: '2',
      timestamp: '2025-12-11 15:02:45',
      userName: 'Thanh Trúc',
      userId: 'user_104',
      action: 'Cập nhật danh mục',
      target: 'Danh mục: "Ngập nước"',
      oldValue: 'Ngập nước',
      newValue: 'Ngập nước nặng',
      ip: '198.51.100.45',
      device: 'Mobile',
      notes: null
    }
  ];

  constructor() {}

  getEntries(): Observable<AuditEntry[]> {
    // In future replace with HTTP call
    return of(this.mock.slice().reverse());
  }
}
