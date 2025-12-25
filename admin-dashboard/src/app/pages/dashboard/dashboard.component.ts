import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="page-container">
      <!-- Welcome Section -->
      <div class="welcome-banner">
        <div class="welcome-content">
          <h1 class="page-title">Xin chào, Admin 👋</h1>
          <p class="page-description">Hệ thống hoạt động ổn định. Có 8 sự cố cần sự chú ý của bạn hôm nay.</p>
        </div>
        <div class="date-display">
          {{ today | date:'EEEE, dd/MM/yyyy' }}
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card warning-card">
          <div class="card-header">
            <div class="stat-icon">
              <span class="material-icons">warning</span>
            </div>
            <span class="trend up">+12% tuần này</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">24</div>
            <div class="stat-label">Sự cố đang xử lý</div>
          </div>
        </div>

        <div class="stat-card success-card">
          <div class="card-header">
            <div class="stat-icon">
              <span class="material-icons">check_circle</span>
            </div>
            <span class="trend up">+5% tuần này</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">156</div>
            <div class="stat-label">Đã hoàn thành</div>
          </div>
        </div>

        <div class="stat-card danger-card">
          <div class="card-header">
            <div class="stat-icon">
              <span class="material-icons">error</span>
            </div>
            <span class="trend down">-2% tuần này</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">8</div>
            <div class="stat-label">Cần xử lý gấp</div>
          </div>
        </div>

        <div class="stat-card info-card">
          <div class="card-header">
            <div class="stat-icon">
              <span class="material-icons">people</span>
            </div>
            <span class="trend up">+18 người mới</span>
          </div>
          <div class="stat-info">
            <div class="stat-value">1,242</div>
            <div class="stat-label">Tổng người dùng</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity & Charts Section -->
      <div class="dashboard-content">
        <!-- Recent Incidents -->
        <div class="content-card recent-incidents">
          <div class="card-header-row">
            <h3>Sự cố mới nhất</h3>
            <button class="btn-link">Xem tất cả</button>
          </div>
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sự cố</th>
                  <th>Khu vực</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of recentIncidents">
                  <td class="id-col">#{{item.id}}</td>
                  <td class="main-col">
                    <div class="incident-info">
                      <span class="incident-name">{{item.title}}</span>
                    </div>
                  </td>
                  <td>{{item.area}}</td>
                  <td>
                    <span class="status-badge" [ngClass]="item.status">
                      {{item.statusLabel}}
                    </span>
                  </td>
                  <td class="time-col">{{item.time}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Actions / System Status -->
        <div class="side-panel">
          <div class="content-card system-status">
            <h3>Trạng thái hệ thống</h3>
            <div class="status-list">
              <div class="status-item">
                <div class="status-label">
                  <span class="dot success"></span> Server API
                </div>
                <span class="status-value success">Hoạt động tốt</span>
              </div>
              <div class="status-item">
                <div class="status-label">
                  <span class="dot success"></span> Database
                </div>
                <span class="status-value success">Hoạt động tốt</span>
              </div>
              <div class="status-item">
                <div class="status-label">
                  <span class="dot warning"></span> Storage
                </div>
                <span class="status-value warning">85% Đầy</span>
              </div>
            </div>
          </div>

          <div class="content-card quick-actions">
            <h3>Thao tác nhanh</h3>
            <div class="action-buttons">
              <button class="action-btn">
                <span class="material-icons">add_alert</span>
                Tạo báo cáo
              </button>
              <button class="action-btn">
                <span class="material-icons">person_add</span>
                Thêm user
              </button>
              <button class="action-btn">
                <span class="material-icons">file_download</span>
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding-bottom: 40px;
    }

    .page-container {
      max-width: 1440px;
      margin: 0 auto;
      animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Welcome Banner - Premium */
    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 36px;
      padding: 36px 40px;
      background: linear-gradient(135deg, #ffffff 0%, #fafbfc 50%, #f8fafc 100%);
      border-radius: 24px;
      border: 1px solid rgba(229, 231, 235, 0.6);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.03);
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .welcome-banner::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .welcome-banner:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.04);
    }

    .page-title {
      font-size: 36px;
      font-weight: 900;
      background: linear-gradient(135deg, #111827 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 10px 0;
      letter-spacing: -1.5px;
      line-height: 1.2;
    }

    .page-description {
      font-size: 16px;
      color: #64748b;
      margin: 0;
      font-weight: 500;
      letter-spacing: -0.2px;
    }

    .date-display {
      font-size: 14px;
      font-weight: 700;
      color: #475569;
      background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
      padding: 14px 24px;
      border-radius: 28px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(229, 231, 235, 0.6);
      letter-spacing: 0.3px;
      position: relative;
      z-index: 1;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .date-display:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    /* Stats Grid - Premium Design */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 36px;
    }

    .stat-card {
      background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.08),
                  0 4px 12px -2px rgba(0, 0, 0, 0.04);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(229, 231, 235, 0.5);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.03) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .stat-card:hover::before {
      opacity: 1;
    }

    .stat-card:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 20px 40px -8px rgba(0, 0, 0, 0.15),
                  0 10px 20px -4px rgba(0, 0, 0, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stat-card:hover .stat-icon {
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .stat-icon .material-icons {
      font-size: 28px;
    }

    .trend {
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 20px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      backdrop-filter: blur(10px);
    }

    .trend.up {
      background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
      color: #047857;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .trend.down {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #b91c1c;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .stat-value {
      font-size: 42px;
      font-weight: 900;
      background: linear-gradient(135deg, #111827 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 10px;
      letter-spacing: -2px;
    }

    .stat-label {
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      letter-spacing: 0.2px;
    }

    /* Card Variants - Premium Colors */
    .warning-card {
      background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%);
      border-color: rgba(251, 146, 60, 0.1);
    }
    .warning-card .stat-icon {
      background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
      color: white;
    }

    .success-card {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-color: rgba(34, 197, 94, 0.1);
    }
    .success-card .stat-icon {
      background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
      color: white;
    }

    .danger-card {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      border-color: rgba(239, 68, 68, 0.1);
    }
    .danger-card .stat-icon {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      color: white;
    }

    .info-card {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: rgba(59, 130, 246, 0.1);
    }
    .info-card .stat-icon {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
      color: white;
    }

    /* Dashboard Content Layout */
    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 28px;
    }

    .content-card {
      background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(229, 231, 235, 0.5);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .content-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .content-card:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 6px 16px rgba(0, 0, 0, 0.06);
      transform: translateY(-4px);
      border-color: rgba(59, 130, 246, 0.2);
    }

    .content-card:hover::before {
      transform: scaleX(1);
    }

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f3f4f6;
    }

    .content-card h3 {
      font-size: 19px;
      font-weight: 800;
      background: linear-gradient(135deg, #111827 0%, #374151 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: -0.3px;
    }

    .btn-link {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #bfdbfe;
      color: #2563eb;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .btn-link:hover {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }

    /* Modern Table - Premium Style */
    .modern-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 8px;
    }

    .modern-table th {
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
      border-top: 2px solid #e5e7eb;
      border-bottom: 2px solid #e5e7eb;
    }

    .modern-table th:first-child {
      border-left: 2px solid #e5e7eb;
      border-radius: 12px 0 0 12px;
    }

    .modern-table th:last-child {
      border-right: 2px solid #e5e7eb;
      border-radius: 0 12px 12px 0;
    }

    .modern-table td {
      padding: 18px 16px;
      border-top: 1px solid #f3f4f6;
      border-bottom: 1px solid #f3f4f6;
      font-size: 14px;
      color: #374151;
      background: white;
      transition: all 0.2s ease;
    }

    .modern-table td:first-child {
      border-left: 1px solid #f3f4f6;
    }

    .modern-table td:last-child {
      border-right: 1px solid #f3f4f6;
    }

    .modern-table tr {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modern-table tr:hover td {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #bfdbfe;
      transform: translateX(2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
    }

    .modern-table tr:hover td:first-child {
      border-radius: 12px 0 0 12px;
    }

    .modern-table tr:hover td:last-child {
      border-radius: 0 12px 12px 0;
    }

    .id-col {
      font-family: 'JetBrains Mono', monospace;
      color: #6b7280;
      font-weight: 600;
    }
    .incident-name {
      font-weight: 600;
      color: #111827;
    }
    .time-col {
      color: #9ca3af;
      font-size: 13px;
      font-weight: 500;
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .status-badge.new {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1e40af;
      border: 1px solid #93c5fd;
    }
    .status-badge.processing {
      background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
      color: #9a3412;
      border: 1px solid #fb923c;
    }
    .status-badge.done {
      background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
      color: #14532d;
      border: 1px solid #4ade80;
    }

    /* Side Panel - Premium */
    .side-panel {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .status-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      transition: all 0.3s ease;
    }

    .status-item:hover {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #bfdbfe;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .status-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .dot.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    .dot.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .status-value {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }

    .status-value.success {
      color: #047857;
      text-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
    }
    .status-value.warning {
      color: #c2410c;
      text-shadow: 0 0 8px rgba(251, 146, 60, 0.3);
    }

    /* Quick Actions - Premium Buttons */
    .action-buttons {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .action-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .action-btn:hover::before {
      left: 100%;
    }

    .action-btn:hover {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #bfdbfe;
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
    }

    .action-btn .material-icons {
      font-size: 22px;
      color: #3b82f6;
      transition: transform 0.3s ease;
    }

    .action-btn:hover .material-icons {
      transform: scale(1.2) rotate(10deg);
    }

    @media (max-width: 1024px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  today = new Date();

  recentIncidents = [
    { id: '1024', title: 'Ngập lụt đường Nguyễn Huệ', area: 'Quận 1', status: 'new', statusLabel: 'Mới tiếp nhận', time: '10 phút trước' },
    { id: '1023', title: 'Cây đổ chắn ngang đường', area: 'Quận 3', status: 'processing', statusLabel: 'Đang xử lý', time: '30 phút trước' },
    { id: '1022', title: 'Hố tử thần xuất hiện', area: 'Thủ Đức', status: 'processing', statusLabel: 'Đang xử lý', time: '1 giờ trước' },
    { id: '1021', title: 'Đèn đường hỏng hàng loạt', area: 'Quận 7', status: 'done', statusLabel: 'Đã xong', time: '2 giờ trước' },
    { id: '1020', title: 'Tắc cống gây ngập cục bộ', area: 'Bình Thạnh', status: 'done', statusLabel: 'Đã xong', time: '3 giờ trước' },
  ];
}
