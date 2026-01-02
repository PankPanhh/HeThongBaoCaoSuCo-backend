import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from './incident.service';
import {
  Incident,
  IncidentStatus,
  IncidentPriority,
  IncidentStatusLabels,
  IncidentPriorityLabels,
} from './incident.model';

@Component({
  selector: 'app-incidents-list',
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="w-full mx-auto mb-[5em]">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Danh sách sự cố</h1>
          <p class="text-gray-600">
            Quản lý và theo dõi tất cả sự cố trong hệ thống
          </p>
        </div>

        <!-- Filters Section -->
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Tìm kiếm</label
              >
              <div class="relative">
                <span
                  class="material-icons absolute left-3 top-2.5 text-gray-400 text-xl"
                  >search</span
                >
                <input
                  type="text"
                  [ngModel]="searchText"
                  (ngModelChange)="searchText = $event; applyFilters()"
                  placeholder="Tìm theo ID hoặc tiêu đề..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Trạng thái</label
              >
              <select
                [ngModel]="filterStatus"
                (ngModelChange)="filterStatus = $event; applyFilters()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option
                  *ngFor="let status of statusOptions"
                  [value]="status.value"
                >
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Priority Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Mức độ ưu tiên</label
              >
              <select
                [ngModel]="filterPriority"
                (ngModelChange)="filterPriority = $event; applyFilters()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả mức độ</option>
                <option
                  *ngFor="let priority of priorityOptions"
                  [value]="priority.value"
                >
                  {{ priority.label }}
                </option>
              </select>
            </div>

            <!-- Area Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Khu vực</label
              >
              <select
                [ngModel]="filterArea"
                (ngModelChange)="filterArea = $event; applyFilters()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả khu vực</option>
                <option *ngFor="let area of areaOptions" [value]="area">
                  {{ area }}
                </option>
              </select>
            </div>
          </div>

          <!-- Reset Button -->
          <div class="mt-4 flex justify-end">
            <button
              (click)="resetFilters()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span class="material-icons text-sm align-middle mr-1"
                >refresh</span
              >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Tổng sự cố</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ filteredIncidents.length }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <span class="material-icons text-blue-600">list</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Đang xử lý</p>
                <p class="text-2xl font-bold text-orange-600">
                  {{ getCountByStatus('processing') }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"
              >
                <span class="material-icons text-orange-600">pending</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Khẩn cấp</p>
                <p class="text-2xl font-bold text-red-600">
                  {{ getCountByPriority('urgent') }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"
              >
                <span class="material-icons text-red-600">error</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Đã giải quyết</p>
                <p class="text-2xl font-bold text-green-600">
                  {{ getCountByStatus('resolved') }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
              >
                <span class="material-icons text-green-600">check_circle</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Incidents Table -->
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-5"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Sự cố
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Khu vực
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Loại
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Ưu tiên
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Người báo cáo
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Ngày báo cáo
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  *ngFor="let incident of filteredIncidents"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm font-medium text-blue-600">{{
                      incident.id
                    }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="max-w-xs">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ incident.title }}
                      </p>
                      <p class="text-xs text-gray-500 truncate mt-1">
                        {{ incident.description }}
                      </p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-700">{{
                      incident.area
                    }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-700">{{
                      incident.type
                    }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getStatusClass(incident.status)"
                    >
                      {{ getStatusLabel(incident.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      [ngClass]="getPriorityClass(incident.priority)"
                    >
                      {{ getPriorityLabel(incident.priority) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ incident.reportedBy }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ incident.reportedDate | date : 'dd/MM/yyyy HH:mm' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center space-x-2">
                      <button
                        (click)="viewDetail(incident)"
                        class="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Xem chi tiết"
                      >
                        <span class="material-icons text-lg">visibility</span>
                      </button>
                      <button
                        (click)="editIncident(incident)"
                        class="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span class="material-icons text-lg">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div
              *ngIf="filteredIncidents.length === 0"
              class="text-center py-12"
            >
              <span class="material-icons text-gray-300 text-6xl">inbox</span>
              <p class="mt-4 text-gray-500">Không tìm thấy sự cố nào</p>
              <button
                (click)="resetFilters()"
                class="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class IncidentsListComponent implements OnInit {
  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];

  // Filters
  searchText: string = '';
  filterStatus: string = '';
  filterPriority: string = '';
  filterArea: string = '';

  statusOptions = [
    { value: IncidentStatus.NEW, label: 'Mới' },
    { value: IncidentStatus.ASSIGNED, label: 'Đã gửi' },
    { value: IncidentStatus.PROCESSING, label: 'Đang xử lý' },
    { value: IncidentStatus.RESOLVED, label: 'Đã giải quyết' },
    { value: IncidentStatus.REOPENED, label: 'Mở lại' },
  ];

  priorityOptions = [
    { value: IncidentPriority.LOW, label: 'Thấp' },
    { value: IncidentPriority.MEDIUM, label: 'Trung bình' },
    { value: IncidentPriority.HIGH, label: 'Cao' },
    { value: IncidentPriority.URGENT, label: 'Khẩn cấp' },
  ];

  areaOptions: string[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidents = this.incidentService.getAllIncidents();
    this.filteredIncidents = [...this.incidents];

    // Extract unique areas
    const areas = new Set(
      this.incidents.map((inc) => inc.area.split(' - ')[0])
    );
    this.areaOptions = Array.from(areas).sort();
  }

  applyFilters(): void {
    this.filteredIncidents = this.incidents.filter((incident) => {
      // Search filter
      if (this.searchText) {
        const searchLower = this.searchText.toLowerCase();
        const matchesSearch =
          incident.id.toLowerCase().includes(searchLower) ||
          incident.title.toLowerCase().includes(searchLower) ||
          incident.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (this.filterStatus && incident.status !== this.filterStatus) {
        return false;
      }

      // Priority filter
      if (this.filterPriority && incident.priority !== this.filterPriority) {
        return false;
      }

      // Area filter
      if (this.filterArea && !incident.area.includes(this.filterArea)) {
        return false;
      }

      return true;
    });
  }

  resetFilters(): void {
    this.searchText = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterArea = '';
    this.applyFilters();
  }

  getCountByStatus(status: string): number {
    return this.filteredIncidents.filter((inc) => inc.status === status).length;
  }

  getCountByPriority(priority: string): number {
    return this.filteredIncidents.filter((inc) => inc.priority === priority)
      .length;
  }

  getStatusLabel(status: IncidentStatus): string {
    return IncidentStatusLabels[status];
  }

  getPriorityLabel(priority: IncidentPriority): string {
    return IncidentPriorityLabels[priority];
  }

  getStatusClass(status: IncidentStatus): string {
    const classes: Record<IncidentStatus, string> = {
      [IncidentStatus.NEW]: 'bg-blue-100 text-blue-800',
      [IncidentStatus.ASSIGNED]: 'bg-purple-100 text-purple-800',
      [IncidentStatus.PROCESSING]: 'bg-orange-100 text-orange-800',
      [IncidentStatus.RESOLVED]: 'bg-green-100 text-green-800',
      [IncidentStatus.REOPENED]: 'bg-red-100 text-red-800',
    };
    return classes[status];
  }

  getPriorityClass(priority: IncidentPriority): string {
    const classes: Record<IncidentPriority, string> = {
      [IncidentPriority.LOW]: 'bg-gray-100 text-gray-800',
      [IncidentPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [IncidentPriority.HIGH]: 'bg-orange-100 text-orange-800',
      [IncidentPriority.URGENT]: 'bg-red-100 text-red-800',
    };
    return classes[priority];
  }

  viewDetail(incident: Incident): void {
    console.log('View detail:', incident);
    // TODO: Navigate to detail page or open modal
  }

  editIncident(incident: Incident): void {
    console.log('Edit incident:', incident);
    // TODO: Navigate to edit page or open modal
  }
}
