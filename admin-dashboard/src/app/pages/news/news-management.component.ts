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

        <div *ngIf="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Đang tải...</p>
        </div>

        <div
          *ngIf="!loading && currentTab === 'active'"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ưu tiên</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let alert of filteredAlerts" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ alert.title }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-md">{{ alert.content }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'px-2 py-1 text-xs rounded-full border ' + getTypeColor(alert.type)">
                    {{ getTypeLabel(alert.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900">{{ alert.priority }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(alert.start_time) }}</div>
                  <div class="text-sm text-gray-500">đến {{ formatDate(alert.end_time) }}</div>
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
                    [class]="alert.is_active ? 'text-red-600 hover:text-red-900 mr-4' : 'text-green-600 hover:text-green-900 mr-4'"
                    title="Bật/tắt hiển thị"
                  >
                    <span class="material-icons text-xl">{{ alert.is_active ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                  <button (click)="openEditModal(alert)" class="text-blue-600 hover:text-blue-900 mr-4" title="Chỉnh sửa">
                    <span class="material-icons text-xl">edit</span>
                  </button>
                  <button (click)="deleteAlert(alert)" class="text-red-600 hover:text-red-900" title="Xóa">
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

        <div
          *ngIf="!loading && currentTab === 'trash'"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div class="p-6 bg-red-50 border-b border-red-200">
             <div class="flex items-center gap-2">
              <span class="material-icons text-red-600">info</span>
              <p class="text-sm text-red-800">
                Các tin tức trong thùng rác có thể được khôi phục hoặc xóa vĩnh viễn.
              </p>
            </div>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày xóa</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let alert of trashedAlerts" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ alert.title }}</div>
                  <div class="text-sm text-gray-500 truncate max-w-md">{{ alert.content }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="'px-2 py-1 text-xs rounded-full border ' + getTypeColor(alert.type)">
                    {{ getTypeLabel(alert.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ alert.deleted_at ? formatDate(alert.deleted_at) : 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="restoreAlert(alert)" class="text-green-600 hover:text-green-900 mr-4" title="Khôi phục">
                    <span class="material-icons text-xl">restore</span>
                  </button>
                  <button (click)="permanentDeleteAlert(alert)" class="text-red-600 hover:text-red-900" title="Xóa vĩnh viễn">
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
                rows="3"
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
                Ảnh Banner chính
              </label>

              <div *ngIf="!formData.banner_image" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer relative">
                <div class="space-y-1 text-center">
                  <span class="material-icons text-4xl text-gray-400">image</span>
                  <div class="flex text-sm text-gray-600 justify-center">
                    <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload ảnh banner</span>
                      <input type="file" class="sr-only" accept="image/*" (change)="onBannerImageSelected($event)">
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                </div>
              </div>

              <div *ngIf="formData.banner_image" class="relative mt-2 rounded-lg overflow-hidden border border-gray-200 group">
                <img
                  [src]="formData.banner_image"
                  class="w-full h-48 object-cover bg-gray-100"
                  alt="Banner"
                  (error)="onBannerImageError($event)"
                  (load)="onBannerImageLoad($event)"
                >

                <!-- Hiển thị badge "Chưa lưu" nếu là preview -->
                <div *ngIf="pendingBannerFile" class="absolute top-2 left-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
                  Chưa lưu
                </div>

                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                  <label class="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 cursor-pointer shadow-lg" title="Thay đổi ảnh">
                    <span class="material-icons">edit</span>
                    <input type="file" class="sr-only" accept="image/*" (change)="onBannerImageSelected($event)">
                  </label>
                  <button type="button" (click)="removeBannerImage()" class="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 shadow-lg" title="Xóa ảnh">
                    <span class="material-icons">delete</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Link bài viết (nếu có)
              </label>
              <div class="flex rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  http://
                </span>
                <input
                  type="text"
                  [(ngModel)]="formData.article_url"
                  name="article_url"
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="vnexpress.net/..."
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thư viện hình ảnh / Video
              </label>

              <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
                <!-- Ảnh đã được upload (từ server) -->
                <div *ngFor="let imgUrl of formData.gallery; let i = index" class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      [src]="imgUrl"
                      class="w-full h-full object-cover"
                      alt="Gallery item"
                      (error)="onGalleryImageError($event, i)"
                      (load)="onGalleryImageLoad($event, i)"
                    >
                    <button
                        type="button"
                        (click)="removeGalleryImage(i)"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                        title="Xóa ảnh"
                    >
                        <span class="material-icons text-sm block">close</span>
                    </button>
                </div>

                <!-- Ảnh preview chưa upload -->
                <div *ngFor="let preview of galleryPreviews; let i = index" class="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300 border-dashed">
                    <img [src]="preview" class="w-full h-full object-cover" alt="Preview">
                    <div class="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                        Chưa lưu
                    </div>
                    <button
                        type="button"
                        (click)="removeGalleryPreview(i)"
                        class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                        title="Xóa preview"
                    >
                        <span class="material-icons text-sm block">close</span>
                    </button>
                </div>

                <label class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                    <span class="material-icons text-3xl text-gray-400 mb-1">add_photo_alternate</span>
                    <span class="text-xs text-gray-500 font-medium">Thêm ảnh</span>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        (change)="onGalleryFilesSelected($event)"
                        class="hidden"
                    />
                </label>
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

            <div class="flex items-center pt-2">
              <input
                type="checkbox"
                [(ngModel)]="formData.is_active"
                name="is_active"
                id="is_active"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="is_active" class="ml-2 block text-sm text-gray-900 font-medium">
                Kích hoạt hiển thị ngay
              </label>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              [disabled]="saving"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-sm flex items-center gap-2"
            >
              <span *ngIf="saving" class="material-icons text-sm animate-spin">refresh</span>
              {{ saving ? 'Đang lưu và upload ảnh...' : (pendingBannerFile || pendingGalleryFiles.length > 0 ? 'Lưu và upload ảnh' : 'Lưu tin tức') }}
            </button>
          </div>

          <!-- Thông báo khi có ảnh chưa lưu -->
          <div *ngIf="(pendingBannerFile || pendingGalleryFiles.length > 0) && !saving" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <span class="material-icons text-blue-600 text-sm mt-0.5">info</span>
            <p class="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Bạn có {{ pendingBannerFile ? '1 ảnh banner' : '' }}{{ pendingBannerFile && pendingGalleryFiles.length > 0 ? ' và ' : '' }}{{ pendingGalleryFiles.length > 0 ? pendingGalleryFiles.length + ' ảnh gallery' : '' }} chưa được lưu. Ảnh sẽ được upload khi bạn ấn "Lưu tin tức".
            </p>
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

  // Xóa galleryInput vì không còn dùng textarea nữa
  galleryUploads: any[] = [];

  // Lưu file tạm thời chưa upload
  pendingBannerFile: File | null = null;
  pendingGalleryFiles: File[] = [];
  bannerPreview: string = '';
  galleryPreviews: string[] = [];

  formData: Partial<Alert> = {
    title: '',
    content: '',
    type: 'news',
    priority: 1,
    banner_image: '',
    gallery: [], // Mảng chứa các URL ảnh
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
    this.galleryUploads = []; // Reset uploads
    this.pendingBannerFile = null; // Reset pending files
    this.pendingGalleryFiles = [];
    this.bannerPreview = '';
    this.galleryPreviews = [];
    this.formData = {
      title: '',
      content: '',
      type: 'news',
      priority: 1,
      banner_image: '',
      gallery: [], // Khởi tạo mảng rỗng
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
    this.galleryUploads = [];
    this.pendingBannerFile = null;
    this.pendingGalleryFiles = [];
    this.bannerPreview = '';
    this.galleryPreviews = [];

    const parseDate = (dateStr: string): string => {
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return new Date().toISOString().slice(0, 16);
        return date.toISOString().slice(0, 16);
      } catch (e) {
        return new Date().toISOString().slice(0, 16);
      }
    };

    this.formData = {
      title: alert.title,
      content: alert.content,
      type: alert.type,
      priority: alert.priority,
      banner_image: alert.banner_image || '',
      gallery: alert.gallery ? [...alert.gallery] : [], // Copy mảng
      article_url: alert.article_url || '',
      start_time: parseDate(alert.start_time),
      end_time: parseDate(alert.end_time),
      is_active: alert.is_active,
    };

    // Debug: Kiểm tra dữ liệu ảnh
    console.log('=== DEBUG EDIT MODAL ===');
    console.log('Banner image:', this.formData.banner_image);
    console.log('Gallery images:', this.formData.gallery);
    console.log('========================');

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAlert = null;
    this.galleryUploads = [];
  }

  // Hàm xóa ảnh khỏi gallery (ảnh đã upload)
  removeGalleryImage(index: number): void {
    if (this.formData.gallery) {
      this.formData.gallery.splice(index, 1);
    }
  }

  // Hàm xóa ảnh preview (ảnh chưa upload)
  removeGalleryPreview(index: number): void {
    this.pendingGalleryFiles.splice(index, 1);
    this.galleryPreviews.splice(index, 1);
  }

  // Hàm xóa banner image
  removeBannerImage(): void {
    this.formData.banner_image = '';
    this.pendingBannerFile = null;
    this.bannerPreview = '';
  }

  // Xử lý khi ảnh banner bị lỗi
  onBannerImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    console.error('Banner image failed to load:', this.formData.banner_image);
    console.error('Image URL:', img.src);
    // Có thể thêm placeholder hoặc thông báo lỗi
  }

  // Xử lý khi ảnh banner load thành công
  onBannerImageLoad(event: Event): void {
    console.log('Banner image loaded successfully:', this.formData.banner_image);
  }

  // Xử lý khi ảnh gallery bị lỗi
  onGalleryImageError(event: Event, index: number): void {
    const img = event.target as HTMLImageElement;
    console.error(`Gallery image ${index} failed to load:`, this.formData.gallery?.[index]);
    console.error('Image URL:', img.src);
  }

  // Xử lý khi ảnh gallery load thành công
  onGalleryImageLoad(event: Event, index: number): void {
    console.log(`Gallery image ${index} loaded successfully:`, this.formData.gallery?.[index]);
  }

  async saveAlert(): Promise<void> {
    if (!this.formData.title || !this.formData.content) {
      window.alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    this.saving = true;

    try {
      // Upload banner image nếu có file pending
      if (this.pendingBannerFile) {
        const bannerUrl = await this.uploadImagePromise(this.pendingBannerFile);
        this.formData.banner_image = bannerUrl;
      }

      // Upload gallery images nếu có files pending
      if (this.pendingGalleryFiles.length > 0) {
        const uploadPromises = this.pendingGalleryFiles.map(file =>
          this.uploadImagePromise(file)
        );
        const uploadedUrls = await Promise.all(uploadPromises);

        // Thêm URLs mới vào gallery hiện tại
        if (!this.formData.gallery) {
          this.formData.gallery = [];
        }
        this.formData.gallery.push(...uploadedUrls);
      }

      // Sau khi upload xong, tạo alert data
      const alertData = {
        ...this.formData,
        start_time: new Date(this.formData.start_time!).toISOString(),
        end_time: new Date(this.formData.end_time!).toISOString(),
        created_by: 'admin',
      };

      if (this.editingAlert) {
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
    } catch (error) {
      console.error('Error uploading images:', error);
      window.alert('Lỗi khi upload ảnh');
      this.saving = false;
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
    if (!confirm(`Bạn có chắc muốn chuyển tin tức "${alertItem.title}" vào thùng rác?`)) {
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
    if (!confirm(`Bạn có chắc muốn khôi phục tin tức "${alertItem.title}"?`)) return;

    this.newsService.restoreAlert(alertItem.id || alertItem._id!).subscribe({
      next: () => {
        window.alert('Đã khôi phục tin tức thành công');
        this.loadTrash();
        this.loadAlerts();
        this.loadStatistics();
      },
      error: (err) => {
        window.alert('Lỗi khi khôi phục tin tức');
      },
    });
  }

  permanentDeleteAlert(alertItem: Alert): void {
    if (!confirm(`⚠️ XÓA VĨNH VIỄN ⚠️\n\nBạn có CHẮC CHẮN muốn xóa vĩnh viễn tin tức "${alertItem.title}"?`)) return;

    this.newsService.permanentDeleteAlert(alertItem.id || alertItem._id!).subscribe({
      next: () => {
        window.alert('✅ Đã xóa vĩnh viễn tin tức khỏi database');
        this.loadTrash();
        this.loadStatistics();
      },
      error: (err) => {
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
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_IMAGE_SIZE) {
        window.alert(`Ảnh vượt quá 5MB.`);
        return;
      }

      // Lưu file tạm thời và tạo preview
      this.pendingBannerFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.bannerPreview = e.target?.result as string;
        // Hiển thị preview thay vì URL thật
        this.formData.banner_image = this.bannerPreview;
      };
      reader.readAsDataURL(file);
    }
  }

  onGalleryFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const isVideo = file.type.startsWith('video');
        const MAX_SIZE = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

        if (file.size > MAX_SIZE) {
          window.alert(`${file.name} quá lớn.`);
          return;
        }

        // Lưu file tạm thời
        this.pendingGalleryFiles.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          // Thêm preview vào danh sách
          this.galleryPreviews.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Hàm upload với Promise để dùng async/await
  private uploadImagePromise(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success && response.data.imageUrl) {
              resolve(response.data.imageUrl);
            } else {
              reject(new Error(response.error || 'Upload failed'));
            }
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });

      xhr.open('POST', 'http://localhost:3001/api/admin/alerts/upload-image');
      xhr.send(formData);
    });
  }

  private uploadImage(file: File, onSuccess: (url: string) => void, onProgress?: (progress: number) => void): void {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        if (onProgress) onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.data.imageUrl) {
            onSuccess(response.data.imageUrl);
          } else {
            window.alert('Lỗi upload: ' + (response.error || 'Unknown error'));
          }
        } catch (e) {
          console.error(e);
        }
      }
    });

    xhr.open('POST', 'http://localhost:3001/api/admin/alerts/upload-image');
    xhr.send(formData);
  }
}
