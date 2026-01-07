import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentService } from './incident.service';
import {
  Incident,
  IncidentPriorityLabels,
  IncidentStatusLabels,
} from './incident.model';

interface AreaGroup {
  area: string;
  count: number;
  incidents: Incident[];
  highPriorityCount: number;
  unresolvedCount: number;
}

@Component({
  selector: 'app-incidents-by-area',
  template: `
    <div class="min-h-screen bg-gray-50 p-6 ">
      <div class="max-w-7xl mx-auto overflow mb-[5em]">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Sự cố theo khu vực
          </h1>
          <p class="text-gray-600">
            Phân tích sự cố theo địa điểm và khu vực xảy ra
          </p>
        </div>

        <!-- Filter Bar -->
        <div
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Sắp xếp theo</label
              >
              <select
                [ngModel]="sortBy"
                (ngModelChange)="sortBy = $event; applySorting()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="count">Số lượng sự cố</option>
                <option value="highPriority">Ưu tiên cao</option>
                <option value="unresolved">Chưa giải quyết</option>
                <option value="name">Tên khu vực</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Loại sự cố</label
              >
              <select
                [ngModel]="filterType"
                (ngModelChange)="filterType = $event; applyFilters()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tất cả loại</option>
                <option *ngFor="let type of incidentTypes" [value]="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Chế độ xem</label
              >
              <div class="flex space-x-2">
                <button
                  (click)="viewMode = 'grid'"
                  [ngClass]="
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  "
                  class="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <span class="material-icons text-sm align-middle"
                    >grid_view</span
                  >
                  Lưới
                </button>
                <button
                  (click)="viewMode = 'list'"
                  [ngClass]="
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  "
                  class="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <span class="material-icons text-sm align-middle"
                    >view_list</span
                  >
                  Danh sách
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Areas Summary -->
        <div
          class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white"
        >
          <h3 class="text-xl font-semibold mb-4">Khu vực "nóng" nhất</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              *ngFor="let area of topAreas; let i = index"
              class="bg-white/10 backdrop-blur rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-3xl font-bold">#{{ i + 1 }}</span>
                <span class="material-icons text-3xl">location_on</span>
              </div>
              <p class="font-semibold text-lg mb-1">{{ area.area }}</p>
              <p class="text-sm opacity-90">{{ area.count }} sự cố</p>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div
          *ngIf="viewMode === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            *ngFor="let group of displayedAreaGroups"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
          >
            <!-- Area Header -->
            <div
              class="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200"
            >
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ group.area }}
                </h3>
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <span class="material-icons text-blue-600">location_on</span>
                </div>
              </div>
              <div class="flex items-center space-x-4 text-sm">
                <span class="text-gray-600">
                  <span class="font-semibold text-gray-900">{{
                    group.count
                  }}</span>
                  sự cố
                </span>
                <span *ngIf="group.highPriorityCount > 0" class="text-red-600">
                  <span class="font-semibold">{{
                    group.highPriorityCount
                  }}</span>
                  khẩn cấp
                </span>
              </div>
            </div>

            <!-- Area Stats -->
            <div class="p-5">
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="bg-orange-50 rounded-lg p-3">
                  <p class="text-xs text-gray-600 mb-1">Chưa giải quyết</p>
                  <p class="text-xl font-bold text-orange-600">
                    {{ group.unresolvedCount }}
                  </p>
                </div>
                <div class="bg-green-50 rounded-lg p-3">
                  <p class="text-xs text-gray-600 mb-1">Đã xong</p>
                  <p class="text-xl font-bold text-green-600">
                    {{ group.count - group.unresolvedCount }}
                  </p>
                </div>
              </div>

              <!-- Recent Incidents -->
              <div class="space-y-2">
                <p
                  class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
                >
                  Sự cố gần đây
                </p>
                <div
                  *ngFor="let incident of group.incidents.slice(0, 3)"
                  class="text-sm border-l-2 pl-3 py-1"
                  [ngClass]="getIncidentBorderClass(incident)"
                >
                  <p class="font-medium text-gray-900 truncate">
                    {{ incident.title }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ incident.reportedDate | date : 'dd/MM HH:mm' }}
                  </p>
                </div>
              </div>

              <!-- View All Button -->
              <button
                (click)="expandArea(group.area)"
                class="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Xem tất cả {{ group.count }} sự cố
              </button>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div *ngIf="viewMode === 'list'" class="space-y-4">
          <div
            *ngFor="let group of displayedAreaGroups"
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <!-- Area Header -->
            <div
              class="px-6 py-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              (click)="toggleAreaExpansion(group.area)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div
                    class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <span class="material-icons text-blue-600"
                      >location_on</span
                    >
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ group.area }}
                    </h3>
                    <div
                      class="flex items-center space-x-4 text-sm text-gray-600 mt-1"
                    >
                      <span>{{ group.count }} sự cố</span>
                      <span
                        *ngIf="group.highPriorityCount > 0"
                        class="text-red-600 font-medium"
                      >
                        {{ group.highPriorityCount }} khẩn cấp
                      </span>
                      <span class="text-orange-600"
                        >{{ group.unresolvedCount }} chưa giải quyết</span
                      >
                    </div>
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <div class="text-right">
                    <div class="flex space-x-2">
                      <div
                        class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                      >
                        {{ group.unresolvedCount }} chưa xong
                      </div>
                      <div
                        class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {{ group.count - group.unresolvedCount }} đã xong
                      </div>
                    </div>
                  </div>
                  <span class="material-icons text-gray-400">
                    {{
                      expandedAreas.has(group.area)
                        ? 'expand_less'
                        : 'expand_more'
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Incidents List -->
            <div *ngIf="expandedAreas.has(group.area)" class="p-6">
              <div class="space-y-3">
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
                          [ngClass]="getStatusClass(incident.status)"
                        >
                          {{ getStatusLabel(incident.status) }}
                        </span>
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
                      </div>
                    </div>

                    <div class="ml-4 flex space-x-2">
                      <button
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <span class="material-icons">visibility</span>
                      </button>
                      <button
                        class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <span class="material-icons">edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Area Statistics -->
        <div
          class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Phân tích theo khu vực
          </h3>
          <div class="space-y-3">
            <div
              *ngFor="let group of displayedAreaGroups"
              class="flex items-center"
            >
              <div class="w-32 text-sm font-medium text-gray-700">
                {{ group.area }}
              </div>
              <div class="flex-1 ml-4">
                <div class="flex items-center">
                  <div
                    class="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden"
                  >
                    <div
                      class="bg-blue-600 h-full rounded-full transition-all"
                      [style.width.%]="(group.count / maxCount) * 100"
                    ></div>
                  </div>
                  <span
                    class="ml-3 text-sm font-semibold text-gray-900 w-12 text-right"
                  >
                    {{ group.count }}
                  </span>
                </div>
              </div>
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
export class IncidentsByAreaComponent implements OnInit {
  areaGroups: AreaGroup[] = [];
  displayedAreaGroups: AreaGroup[] = [];
  expandedAreas = new Set<string>();
  topAreas: AreaGroup[] = [];
  maxCount = 0;

  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'count' | 'highPriority' | 'unresolved' | 'name' = 'count';
  filterType = '';
  incidentTypes: string[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.incidentService.getAllIncidents().subscribe({
      next: (allIncidents) => {
        // Extract unique incident types
        const types = new Set(allIncidents.map((inc) => inc.type));
        this.incidentTypes = Array.from(types).sort();

        // Group incidents by area
        const areaMap = new Map<string, Incident[]>();
        allIncidents.forEach((incident) => {
          const baseArea = incident.area.split(' - ')[0];
          if (!areaMap.has(baseArea)) {
            areaMap.set(baseArea, []);
          }
          areaMap.get(baseArea)!.push(incident);
        });

        // Create area groups
        this.areaGroups = Array.from(areaMap.entries()).map(([area, incidents]) => {
          const highPriorityCount = incidents.filter(
            (inc) => inc.priority === 'high' || inc.priority === 'urgent'
          ).length;

          const unresolvedCount = incidents.filter(
            (inc) => inc.status !== 'resolved'
          ).length;

          return {
            area,
            count: incidents.length,
            incidents: incidents.sort(
              (a, b) =>
                new Date(b.reportedDate).getTime() -
                new Date(a.reportedDate).getTime()
            ),
            highPriorityCount,
            unresolvedCount,
          };
        });

        this.maxCount = Math.max(...this.areaGroups.map((g) => g.count));
        this.topAreas = [...this.areaGroups]
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        this.applySorting();
      },
      error: (error) => {
        console.error('Failed to load incidents by area:', error);
        this.areaGroups = [];
        this.displayedAreaGroups = [];
      }
    });
  }

  applySorting(): void {
    this.displayedAreaGroups = [...this.areaGroups];

    switch (this.sortBy) {
      case 'count':
        this.displayedAreaGroups.sort((a, b) => b.count - a.count);
        break;
      case 'highPriority':
        this.displayedAreaGroups.sort(
          (a, b) => b.highPriorityCount - a.highPriorityCount
        );
        break;
      case 'unresolved':
        this.displayedAreaGroups.sort(
          (a, b) => b.unresolvedCount - a.unresolvedCount
        );
        break;
      case 'name':
        this.displayedAreaGroups.sort((a, b) => a.area.localeCompare(b.area));
        break;
    }

    this.applyFilters();
  }

  applyFilters(): void {
    if (this.filterType) {
      this.displayedAreaGroups = this.displayedAreaGroups
        .map((group) => ({
          ...group,
          incidents: group.incidents.filter(
            (inc) => inc.type === this.filterType
          ),
          count: group.incidents.filter((inc) => inc.type === this.filterType)
            .length,
        }))
        .filter((group) => group.count > 0);
    }
  }

  toggleAreaExpansion(area: string): void {
    if (this.expandedAreas.has(area)) {
      this.expandedAreas.delete(area);
    } else {
      this.expandedAreas.add(area);
    }
  }

  expandArea(area: string): void {
    this.viewMode = 'list';
    this.expandedAreas.add(area);
    setTimeout(() => {
      const element = document.querySelector(`[data-area="${area}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  getStatusLabel(status: string): string {
    return IncidentStatusLabels[status as keyof typeof IncidentStatusLabels];
  }

  getPriorityLabel(priority: string): string {
    return IncidentPriorityLabels[
      priority as keyof typeof IncidentPriorityLabels
    ];
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      processing: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      reopened: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
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

  getIncidentBorderClass(incident: Incident): string {
    if (incident.priority === 'urgent') return 'border-red-500';
    if (incident.priority === 'high') return 'border-orange-500';
    if (incident.status === 'resolved') return 'border-green-500';
    return 'border-blue-500';
  }
}
