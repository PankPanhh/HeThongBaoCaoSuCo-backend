import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsService } from './news.service';
import {
  Alert,
  AlertType,
  AlertTypeLabels,
  AlertTypeColors,
} from './news.model';

@Component({
  selector: 'app-news-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="w-full mx-auto mb-[5em]">
        <!-- Header -->
        <div class="mb-6 flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Quản lý tin tức / Banner
            </h1>
            <p class="text-gray-600">
              Tạo và quản lý tin tức khẩn, thông báo quan trọng
            </p>
          </div>
          <button
            (click)="openCreateModal()"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span class="material-icons text-xl">add</span>
            Thêm tin mới
          </button>
        </div>

        <!-- Tabs -->
        <div class="mb-6 border-b border-gray-200">
          <nav class="flex gap-4" aria-label="Tabs">
            <button
              (click)="currentTab = 'active'"
              [class]="currentTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              <span class="material-icons align-middle mr-1">list</span>
              Tin đang hiển thị
            </button>
            <button
              (click)="currentTab = 'trash'; loadTrash()"
              [class]="currentTab === 'trash' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            >
              <span class="material-icons align-middle mr-1">delete</span>
              Thùng rác
              <span *ngIf="trashedAlerts.length > 0" class="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                {{ trashedAlerts.length }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Tổng số tin</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
              </div>
              <span class="material-icons text-4xl text-blue-500">article</span>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Đang hiển thị</p>
                <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
              </div>
              <span class="material-icons text-4xl text-green-500">visibility</span>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Sắp tới</p>
                <p class="text-2xl font-bold text-amber-600">{{ stats.upcoming }}</p>
              </div>
              <span class="material-icons text-4xl text-amber-500">schedule</span>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Đã hết hạn</p>
                <p class="text-2xl font-bold text-gray-600">{{ stats.expired }}</p>
              </div>
              <span class="material-icons text-4xl text-gray-500">event_busy</span>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Loại tin
              </label>
              <select
                [(ngModel)]="filterType"
                (ngModelChange)="loadAlerts()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="news">Tin tức</option>
                <option value="warning">Cảnh báo</option>
                <option value="info">Thông tin</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                [(ngModel)]="filterActive"
                (ngModelChange)="loadAlerts()"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option [ngValue]="undefined">Tất cả</option>
                <option [ngValue]="true">Đang hiển thị</option>
                <option [ngValue]="false">Đã tắt</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                type="text"
                [(ngModel)]="searchText"
                (ngModelChange)="filterAlerts()"
                placeholder="Tìm theo tiêu đề..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Đang tải...</p>
        </div>

        <!-- Active Alerts Table -->
        <div
          *ngIf="!loading && currentTab === 'active'"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ưu tiên
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let alert of filteredAlerts" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ alert.title }}
                  </div>
                  <div class="text-sm text-gray-500 truncate max-w-md">
                    {{ alert.content }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    [class]="'px-2 py-1 text-xs rounded-full border ' + getTypeColor(alert.type)"
                  >
                    {{ getTypeLabel(alert.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ alert.priority }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(alert.start_time) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    đến {{ formatDate(alert.end_time) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    [class]="
                      alert.is_active && isActiveNow(alert)
                        ? 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'
                        : isExpired(alert)
                        ? 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
                        : 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
                    "
                  >
                    {{
                      alert.is_active && isActiveNow(alert)
                        ? 'Đang hiển thị'
                        : isExpired(alert)
                        ? 'Hết hạn'
                        : 'Đã tắt'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    (click)="toggleStatus(alert)"
                    [class]="
                      alert.is_active
                        ? 'text-red-600 hover:text-red-900 mr-4'
                        : 'text-green-600 hover:text-green-900 mr-4'
                    "
                    title="Bật/tắt hiển thị"
                  >
                    <span class="material-icons text-xl">{{
                      alert.is_active ? 'visibility_off' : 'visibility'
                    }}</span>
                  </button>
                  <button
                    (click)="openEditModal(alert)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                    title="Chỉnh sửa"
                  >
                    <span class="material-icons text-xl">edit</span>
                  </button>
                  <button
                    (click)="deleteAlert(alert)"
                    class="text-red-600 hover:text-red-900"
                    title="Xóa (chuyển vào thùng rác)"
                  >
                    <span class="material-icons text-xl">delete</span>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredAlerts.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                  <span class="material-icons text-5xl mb-2">inbox</span>
                  <p>Không có tin tức nào</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Trash Table -->
        <div
          *ngIf="!loading && currentTab === 'trash'"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-6 bg-red-50 border-b border-red-200">
            <div class="flex items-center gap-2">
              <span class="material-icons text-red-600">info</span>
              <p class="text-sm text-red-800">
                Các tin tức trong thùng rác có thể được khôi phục hoặc xóa vĩnh viễn khỏi cơ sở dữ liệu.
              </p>
            </div>
          </div>

          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày xóa
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let alert of trashedAlerts" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ alert.title }}
                  </div>
                  <div class="text-sm text-gray-500 truncate max-w-md">
                    {{ alert.content }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    [class]="'px-2 py-1 text-xs rounded-full border ' + getTypeColor(alert.type)"
                  >
                    {{ getTypeLabel(alert.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ alert.deleted_at ? formatDate(alert.deleted_at) : 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    (click)="restoreAlert(alert)"
                    class="text-green-600 hover:text-green-900 mr-4"
                    title="Khôi phục"
                  >
                    <span class="material-icons text-xl">restore</span>
                  </button>
                  <button
                    (click)="permanentDeleteAlert(alert)"
                    class="text-red-600 hover:text-red-900"
                    title="Xóa vĩnh viễn khỏi database"
                  >
                    <span class="material-icons text-xl">delete_forever</span>
                  </button>
                </td>
              </tr>
              <tr *ngIf="trashedAlerts.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  <span class="material-icons text-5xl mb-2">delete_outline</span>
                  <p>Thùng rác trống</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      *ngIf="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      (click)="closeModal()"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <h2 class="text-2xl font-bold mb-6">
          {{ editingAlert ? 'Chỉnh sửa tin tức' : 'Thêm tin tức mới' }}
        </h2>

        <form (ngSubmit)="saveAlert()">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="formData.title"
                name="title"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề tin tức"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nội dung <span class="text-red-500">*</span>
              </label>
              <textarea
                [(ngModel)]="formData.content"
                name="content"
                required
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập nội dung tin tức"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Loại tin <span class="text-red-500">*</span>
                </label>
                <select
                  [(ngModel)]="formData.type"
                  name="type"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="urgent">Khẩn cấp</option>
                  <option value="news">Tin tức</option>
                  <option value="warning">Cảnh báo</option>
                  <option value="info">Thông tin</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Độ ưu tiên <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  [(ngModel)]="formData.priority"
                  name="priority"
                  required
                  min="1"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1 = cao nhất"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                URL ảnh banner
              </label>
              <div class="flex gap-2 mb-2">
                <input
                  type="text"
                  [(ngModel)]="formData.banner_image"
                  name="banner_image"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <label class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors font-medium">
                  <span class="material-icons text-xl align-middle mr-1">upload</span>
                  Upload
                  <input
                    #bannerFileInput
                    type="file"
                    accept="image/*"
                    (change)="onBannerImageSelected($event)"
                    class="hidden"
                  />
                </label>
              </div>
              <div *ngIf="formData.banner_image" class="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                <img
                  [src]="formData.banner_image"
                  alt="Banner preview"
                  class="w-full h-full object-cover"
                  (error)="formData.banner_image = ''"
                />
                <button
                  type="button"
                  (click)="formData.banner_image = ''"
                  class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Xoá ảnh"
                >
                  <span class="material-icons text-lg">close</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                URL bài báo chính thống
              </label>
              <input
                type="url"
                [(ngModel)]="formData.article_url"
                name="article_url"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://vnexpress.net/..."
              />
              <p class="mt-1 text-sm text-gray-500">
                Người dùng có thể bấm vào link này để xem bài báo
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thư viện hình ảnh / Video
              </label>
              <textarea
                [(ngModel)]="galleryInput"
                name="galleryInput"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg&#10;https://example.com/video.mp4"
                rows="4"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">
                Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
              </p>

              <!-- File upload for gallery -->
              <label class="mt-2 block px-4 py-3 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors font-medium text-center">
                <span class="material-icons text-xl align-middle mr-1">upload</span>
                Upload từ máy tính
                <input
                  #galleryFileInput
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  (change)="onGalleryFilesSelected($event)"
                  class="hidden"
                />
              </label>

              <!-- Preview gallery uploads -->
              <div *ngIf="galleryUploads.length > 0" class="mt-2 space-y-2">
                <p class="text-sm font-medium text-gray-700">Đang upload:</p>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    *ngFor="let upload of galleryUploads"
                    class="relative h-24 bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <div
                      *ngIf="upload.progress < 100"
                      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    >
                      <div class="text-center text-white">
                        <div class="text-sm">{{ upload.progress }}%</div>
                      </div>
                    </div>
                    <img
                      *ngIf="upload.type.startsWith('image')"
                      [src]="upload.preview"
                      alt="Gallery preview"
                      class="w-full h-full object-cover"
                    />
                    <div
                      *ngIf="upload.type.startsWith('video')"
                      class="w-full h-full flex items-center justify-center bg-gray-200"
                    >
                      <span class="material-icons text-4xl text-gray-400">movie</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian bắt đầu <span class="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  [(ngModel)]="formData.start_time"
                  name="start_time"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian kết thúc <span class="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  [(ngModel)]="formData.end_time"
                  name="end_time"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="formData.is_active"
                name="is_active"
                id="is_active"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                for="is_active"
                class="ml-2 block text-sm text-gray-900"
              >
                Kích hoạt hiển thị ngay
              </label>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              [disabled]="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Đang lưu...' : 'Lưu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class NewsManagementComponent implements OnInit {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  trashedAlerts: Alert[] = [];
  loading = false;
  saving = false;
  showModal = false;
  editingAlert: Alert | null = null;
  currentTab: 'active' | 'trash' = 'active';

  stats = {
    total: 0,
    active: 0,
    expired: 0,
    upcoming: 0,
  };

  filterType = '';
  filterActive: boolean | undefined = undefined;
  searchText = '';
  galleryInput = '';
  galleryUploads: any[] = [];

  formData: Partial<Alert> = {
    title: '',
    content: '',
    type: 'news',
    priority: 1,
    banner_image: '',
    gallery: [],
    article_url: '',
    start_time: '',
    end_time: '',
    is_active: true,
  };

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadAlerts();
    this.loadStatistics();
  }

  loadAlerts(): void {
    this.loading = true;
    const filters: any = {};
    if (this.filterType) filters.type = this.filterType;
    if (this.filterActive !== undefined) filters.is_active = this.filterActive;

    this.newsService.getAllAlerts(filters).subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.filterAlerts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading alerts:', err);
        window.alert('Lỗi khi tải danh sách tin tức');
        this.loading = false;
      },
    });
  }

  loadStatistics(): void {
    this.newsService.getStatistics().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
      },
    });
  }

  filterAlerts(): void {
    if (!this.searchText.trim()) {
      this.filteredAlerts = [...this.alerts];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredAlerts = this.alerts.filter(
        (alert) =>
          alert.title.toLowerCase().includes(searchLower) ||
          alert.content.toLowerCase().includes(searchLower)
      );
    }
  }

  openCreateModal(): void {
    this.editingAlert = null;
    this.galleryInput = '';
    this.formData = {
      title: '',
      content: '',
      type: 'news',
      priority: 1,
      banner_image: '',
      gallery: [],
      article_url: '',
      start_time: new Date().toISOString().slice(0, 16),
      end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      is_active: true,
    };
    this.showModal = true;
  }

  openEditModal(alert: Alert): void {
    this.editingAlert = alert;

    // Safely parse dates with fallback
    const parseDate = (dateStr: string): string => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          // Invalid date, return current time
          console.warn(`Invalid date: ${dateStr}, using current time`);
          return new Date().toISOString().slice(0, 16);
        }
        return date.toISOString().slice(0, 16);
      } catch (e) {
        console.error(`Error parsing date: ${dateStr}`, e);
        return new Date().toISOString().slice(0, 16);
      }
    };

    // Convert gallery array to string for textarea
    this.galleryInput = (alert.gallery || []).join('\n');

    this.formData = {
      title: alert.title,
      content: alert.content,
      type: alert.type,
      priority: alert.priority,
      banner_image: alert.banner_image || '',
      gallery: alert.gallery || [],
      article_url: alert.article_url || '',
      start_time: parseDate(alert.start_time),
      end_time: parseDate(alert.end_time),
      is_active: alert.is_active,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAlert = null;
  }

  saveAlert(): void {
    if (!this.formData.title || !this.formData.content) {
      window.alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Parse gallery from textarea input
    const gallery = this.galleryInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const alertData = {
      ...this.formData,
      gallery: gallery,
      start_time: new Date(this.formData.start_time!).toISOString(),
      end_time: new Date(this.formData.end_time!).toISOString(),
      created_by: 'admin',
    };

    this.saving = true;

    if (this.editingAlert) {
      // Update
      this.newsService
        .updateAlert(this.editingAlert.id || this.editingAlert._id!, alertData)
        .subscribe({
          next: () => {
            window.alert('Cập nhật tin tức thành công');
            this.closeModal();
            this.loadAlerts();
            this.loadStatistics();
            this.saving = false;
          },
          error: (err) => {
            console.error('Error updating alert:', err);
            window.alert('Lỗi khi cập nhật tin tức');
            this.saving = false;
          },
        });
    } else {
      // Create
      this.newsService.createAlert(alertData).subscribe({
        next: () => {
          window.alert('Tạo tin tức thành công');
          this.closeModal();
          this.loadAlerts();
          this.loadStatistics();
          this.saving = false;
        },
        error: (err) => {
          console.error('Error creating alert:', err);
          window.alert('Lỗi khi tạo tin tức');
          this.saving = false;
        },
      });
    }
  }

  toggleStatus(alert: Alert): void {
    const newStatus = !alert.is_active;
    this.newsService
      .toggleAlertStatus(alert.id || alert._id!, newStatus)
      .subscribe({
        next: () => {
          alert.is_active = newStatus;
          this.loadStatistics();
        },
        error: (err) => {
          console.error('Error toggling alert status:', err);
          window.alert('Lỗi khi thay đổi trạng thái');
        },
      });
  }

  deleteAlert(alertItem: Alert): void {
    if (
      !confirm(
        `Bạn có chắc muốn chuyển tin tức "${alertItem.title}" vào thùng rác?\n\nTin này có thể được khôi phục từ thùng rác sau.`
      )
    ) {
      return;
    }

    this.newsService.deleteAlert(alertItem.id || alertItem._id!).subscribe({
      next: () => {
        window.alert('Đã chuyển tin tức vào thùng rác');
        this.loadAlerts();
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Error deleting alert:', err);
        window.alert('Lỗi khi xóa tin tức');
      },
    });
  }

  loadTrash(): void {
    this.loading = true;
    this.newsService.getDeletedAlerts().subscribe({
      next: (alerts) => {
        this.trashedAlerts = alerts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading trash:', err);
        window.alert('Lỗi khi tải thùng rác');
        this.loading = false;
      },
    });
  }

  restoreAlert(alertItem: Alert): void {
    if (
      !confirm(
        `Bạn có chắc muốn khôi phục tin tức "${alertItem.title}"?`
      )
    ) {
      return;
    }

    this.newsService.restoreAlert(alertItem.id || alertItem._id!).subscribe({
      next: () => {
        window.alert('Đã khôi phục tin tức thành công');
        this.loadTrash();
        this.loadAlerts();
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Error restoring alert:', err);
        window.alert('Lỗi khi khôi phục tin tức');
      },
    });
  }

  permanentDeleteAlert(alertItem: Alert): void {
    if (
      !confirm(
        `⚠️ XÓA VĨNH VIỄN ⚠️\n\nBạn có CHẮC CHẮN muốn xóa vĩnh viễn tin tức "${alertItem.title}" khỏi cơ sở dữ liệu?\n\n❌ Hành động này KHÔNG THỂ HOÀN TÁC!\n❌ Dữ liệu sẽ bị XÓA HOÀN TOÀN khỏi database!\n\nNhấn OK để xác nhận xóa vĩnh viễn.`
      )
    ) {
      return;
    }

    // Double confirmation
    if (
      !confirm(
        `XÁC NHẬN LẦN CUỐI!\n\nBạn thật sự muốn xóa vĩnh viễn tin tức "${alertItem.title}"?\nKhông thể khôi phục sau khi xóa!`
      )
    ) {
      return;
    }

    this.newsService.permanentDeleteAlert(alertItem.id || alertItem._id!).subscribe({
      next: () => {
        window.alert('✅ Đã xóa vĩnh viễn tin tức khỏi database');
        this.loadTrash();
        this.loadStatistics();
      },
      error: (err) => {
        console.error('Error permanently deleting alert:', err);
        window.alert('❌ Lỗi khi xóa vĩnh viễn tin tức');
      },
    });
  }

  getTypeLabel(type: AlertType): string {
    return AlertTypeLabels[type] || type;
  }

  getTypeColor(type: AlertType): string {
    return AlertTypeColors[type] || AlertTypeColors.info;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  isActiveNow(alert: Alert): boolean {
    const now = new Date().toISOString();
    return alert.start_time <= now && alert.end_time >= now;
  }

  isExpired(alert: Alert): boolean {
    const now = new Date().toISOString();
    return alert.end_time < now;
  }

  onBannerImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Validate file size (5MB for images)
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_IMAGE_SIZE) {
        window.alert(`Ảnh vượt quá 5MB. Kích thước file: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }

      this.uploadImage(file, (imageUrl) => {
        this.formData.banner_image = imageUrl;
      });
    }
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        // Validate file size
        const isVideo = file.type.startsWith('video');
        const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
        const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        const maxSizeLabel = isVideo ? '50MB' : '5MB';

        if (file.size > maxSize) {
          window.alert(`${file.name} vượt quá ${maxSizeLabel}. Kích thước file: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const upload = {
            name: file.name,
            type: file.type,
            preview: e.target?.result as string,
            progress: 0,
            completed: false,
            uploadedUrl: '',
          };
          this.galleryUploads.push(upload);

          // Start upload after adding to array
          this.uploadImage(file, (imageUrl) => {
            // Add uploaded image URL to gallery input
            if (this.galleryInput) {
              this.galleryInput += '\n' + imageUrl;
            } else {
              this.galleryInput = imageUrl;
            }
            // Mark upload as completed
            upload.completed = true;
            upload.progress = 100;
            upload.uploadedUrl = imageUrl;
          }, (progress) => {
            // Update progress
            upload.progress = progress;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  private uploadImage(file: File, onSuccess: (url: string) => void, onProgress?: (progress: number) => void): void {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        console.log(`Upload progress: ${percentComplete}%`);
        if (onProgress) {
          onProgress(percentComplete);
        }
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.data.imageUrl) {
            console.log('Image uploaded:', response.data.imageUrl);
            onSuccess(response.data.imageUrl);
          } else {
            window.alert('Lỗi upload: ' + (response.error || 'Unknown error'));
          }
        } catch (e) {
          window.alert('Lỗi parse response');
          console.error('Error parsing response:', e);
        }
      } else {
        window.alert(`Lỗi upload: HTTP ${xhr.status}`);
      }
    });

    xhr.addEventListener('error', () => {
      window.alert('Lỗi kết nối server');
    });

    xhr.open('POST', 'http://localhost:3001/api/admin/alerts/upload-image');
    xhr.send(formData);
  }
}
