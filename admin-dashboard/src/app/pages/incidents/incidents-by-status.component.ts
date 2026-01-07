import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentService } from './incident.service';
import {
  Incident,
  IncidentStatus,
  IncidentStatusLabels,
  IncidentPriorityLabels,
} from './incident.model';

interface StatusGroup {
  status: IncidentStatus;
  label: string;
  count: number;
  incidents: Incident[];
  color: string;
  icon: string;
}

@Component({
  selector: 'app-incidents-by-status',
  template: `
    <div class="min-h-screen bg-gray-50 p-6 ">
      <div class="max-w-7xl mx-auto mb-[5em]">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Sự cố theo trạng thái
          </h1>
          <p class="text-gray-600">
            Phân loại và theo dõi sự cố theo từng trạng thái xử lý
          </p>
        </div>

        <!-- Status Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div
            *ngFor="let group of statusGroups"
            class="bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md cursor-pointer"
            [ngClass]="group.color"
            (click)="selectStatus(group.status)"
          >
            <div class="p-5">
              <div class="flex items-center justify-between mb-3">
                <div
                  [ngClass]="
                    'w-12 h-12 rounded-lg flex items-center justify-center ' +
                    group.color.replace('border', 'bg').replace('500', '100')
                  "
                >
                  <span
                    class="material-icons text-2xl"
                    [ngClass]="group.color.replace('border', 'text')"
                  >
                    {{ group.icon }}
                  </span>
                </div>
                <div class="text-right">
                  <p
                    class="text-3xl font-bold"
                    [ngClass]="group.color.replace('border', 'text')"
                  >
                    {{ group.count }}
                  </p>
                </div>
              </div>
              <p class="text-sm font-medium text-gray-700">{{ group.label }}</p>
            </div>
          </div>
        </div>

        <!-- Status Groups Detail -->
        <div class="space-y-6">
          <div
            *ngFor="let group of statusGroups"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <!-- Group Header -->
            <div
              class="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              (click)="toggleGroup(group.status)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    [ngClass]="
                      'w-10 h-10 rounded-lg flex items-center justify-center ' +
                      group.color.replace('border', 'bg').replace('500', '100')
                    "
                  >
                    <span
                      class="material-icons"
                      [ngClass]="group.color.replace('border', 'text')"
                    >
                      {{ group.icon }}
                    </span>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ group.label }}
                    </h3>
                    <p class="text-sm text-gray-500">{{ group.count }} sự cố</p>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    [ngClass]="
                      group.color
                        .replace('border', 'bg')
                        .replace('500', '100') +
                      ' ' +
                      group.color.replace('border', 'text')
                    "
                  >
                    {{ group.count }} sự cố
                  </span>
                  <span class="material-icons text-gray-400">
                    {{
                      expandedGroups.has(group.status)
                        ? 'expand_less'
                        : 'expand_more'
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Group Content -->
            <div *ngIf="expandedGroups.has(group.status)" class="p-6">
              <div *ngIf="group.incidents.length > 0" class="space-y-3">
                <div
                  *ngFor="let incident of group.incidents"
                  class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <span class="text-sm font-semibold text-blue-600">{{
                          incident.id
                        }}</span>
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="getPriorityClass(incident.priority)"
                        >
                          {{ getPriorityLabel(incident.priority) }}
                        </span>
                      </div>
                      <h4 class="text-base font-medium text-gray-900 mb-1">
                        {{ incident.title }}
                      </h4>
                      <p class="text-sm text-gray-600 mb-3">
                        {{ incident.description }}
                      </p>

                      <div
                        class="flex flex-wrap items-center gap-4 text-sm text-gray-500"
                      >
                        <div class="flex items-center">
                          <span class="material-icons text-sm mr-1"
                            >location_on</span
                          >
                          {{ incident.area }}
                        </div>
                        <div class="flex items-center">
                          <span class="material-icons text-sm mr-1"
                            >category</span
                          >
                          {{ incident.type }}
                        </div>
                        <div class="flex items-center">
                          <span class="material-icons text-sm mr-1"
                            >person</span
                          >
                          {{ incident.reportedBy }}
                        </div>
                        <div class="flex items-center">
                          <span class="material-icons text-sm mr-1"
                            >schedule</span
                          >
                          {{
                            incident.reportedDate | date : 'dd/MM/yyyy HH:mm'
                          }}
                        </div>
                        <div
                          *ngIf="incident.assignedTeam"
                          class="flex items-center"
                        >
                          <span class="material-icons text-sm mr-1"
                            >groups</span
                          >
                          {{ incident.assignedTeam }}
                        </div>
                      </div>

                      <!-- Notes -->
                      <div
                        *ngIf="incident.notes && incident.notes.length > 0"
                        class="mt-3 pt-3 border-t border-gray-100"
                      >
                        <p class="text-xs font-medium text-gray-500 mb-2">
                          Ghi chú xử lý:
                        </p>
                        <ul class="space-y-1">
                          <li
                            *ngFor="let note of incident.notes"
                            class="text-sm text-gray-600 flex items-start"
                          >
                            <span class="material-icons text-xs mr-1 mt-0.5"
                              >check_circle</span
                            >
                            {{ note }}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="ml-4 flex flex-col space-y-2">
                      <button
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <span class="material-icons">visibility</span>
                      </button>
                      <button
                        class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span class="material-icons">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                *ngIf="group.incidents.length === 0"
                class="text-center py-8"
              >
                <span class="material-icons text-gray-300 text-5xl">inbox</span>
                <p class="mt-2 text-gray-500">
                  Không có sự cố nào ở trạng thái này
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Summary -->
        <div
          class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Thống kê tổng quan
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p class="text-sm text-gray-600 mb-2">Tổng số sự cố</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ totalIncidents }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">Cần xử lý (Mới + Đã gửi)</p>
              <p class="text-3xl font-bold text-orange-600">
                {{ needAttention }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600 mb-2">Tỷ lệ hoàn thành</p>
              <p class="text-3xl font-bold text-green-600">
                {{ completionRate }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule],
})
export class IncidentsByStatusComponent implements OnInit {
  statusGroups: StatusGroup[] = [];
  expandedGroups = new Set<IncidentStatus>();
  totalIncidents = 0;
  needAttention = 0;
  completionRate = 0;

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadData();
    // Expand all groups by default
    Object.values(IncidentStatus).forEach((status) => {
      this.expandedGroups.add(status);
    });
  }

  loadData(): void {
    this.incidentService.getAllIncidents().subscribe({
      next: (allIncidents) => {
        this.totalIncidents = allIncidents.length;

        this.statusGroups = [
          {
            status: IncidentStatus.NEW,
            label: IncidentStatusLabels[IncidentStatus.NEW],
            count: 0,
            incidents: [],
            color: 'border-blue-500',
            icon: 'new_releases',
          },
          {
            status: IncidentStatus.ASSIGNED,
            label: IncidentStatusLabels[IncidentStatus.ASSIGNED],
            count: 0,
            incidents: [],
            color: 'border-purple-500',
            icon: 'send',
          },
          {
            status: IncidentStatus.PROCESSING,
            label: IncidentStatusLabels[IncidentStatus.PROCESSING],
            count: 0,
            incidents: [],
            color: 'border-orange-500',
            icon: 'pending',
          },
          {
            status: IncidentStatus.RESOLVED,
            label: IncidentStatusLabels[IncidentStatus.RESOLVED],
            count: 0,
            incidents: [],
            color: 'border-green-500',
            icon: 'check_circle',
          },
          {
            status: IncidentStatus.REOPENED,
            label: IncidentStatusLabels[IncidentStatus.REOPENED],
            count: 0,
            incidents: [],
            color: 'border-red-500',
            icon: 'refresh',
          },
        ];

        // Populate groups with incidents
        allIncidents.forEach((incident) => {
          const group = this.statusGroups.find((g) => g.status === incident.status);
          if (group) {
            group.incidents.push(incident);
            group.count++;
          }
        });

        // Sort incidents by date (newest first)
        this.statusGroups.forEach((group) => {
          group.incidents.sort(
            (a, b) =>
              new Date(b.reportedDate).getTime() -
              new Date(a.reportedDate).getTime()
          );
        });

        // Calculate statistics
        const newCount =
          this.statusGroups.find((g) => g.status === IncidentStatus.NEW)?.count ||
          0;
        const assignedCount =
          this.statusGroups.find((g) => g.status === IncidentStatus.ASSIGNED)
            ?.count || 0;
        this.needAttention = newCount + assignedCount;

        const resolved =
          this.statusGroups.find((g) => g.status === IncidentStatus.RESOLVED)
            ?.count || 0;
        this.completionRate =
          this.totalIncidents > 0
            ? Math.round((resolved / this.totalIncidents) * 100)
            : 0;
      },
      error: (error) => {
        console.error('Failed to load incidents by status:', error);
        this.totalIncidents = 0;
        this.statusGroups = [];
      }
    });
  }

  toggleGroup(status: IncidentStatus): void {
    if (this.expandedGroups.has(status)) {
      this.expandedGroups.delete(status);
    } else {
      this.expandedGroups.add(status);
    }
  }

  selectStatus(status: IncidentStatus): void {
    // Expand the selected group
    this.expandedGroups.add(status);
    // Scroll to the group
    setTimeout(() => {
      const element = document.querySelector(`[data-status="${status}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  getPriorityLabel(priority: string): string {
    return IncidentPriorityLabels[
      priority as keyof typeof IncidentPriorityLabels
    ];
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }
}
