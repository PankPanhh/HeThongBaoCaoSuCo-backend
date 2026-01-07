import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SidebarService } from '../sidebar/sidebar.service';

interface Breadcrumb {
  label: string;
  url?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'error' | 'success';
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  showNotifications: boolean = false;
  showUserMenu: boolean = false;
  isCollapsed: boolean = false;
  private sidebarSub?: Subscription;
  private routerSub?: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {}

  breadcrumbs: Breadcrumb[] = [
    { label: 'Dashboard', url: '/dashboard' }
  ];

  notifications: Notification[] = [
    {
      id: 1,
      title: 'Sự cố mới',
      message: 'Ngập lụt tại Quận 1',
      time: '5 phút trước',
      read: false,
      type: 'warning'
    },
    {
      id: 2,
      title: 'Cập nhật trạng thái',
      message: 'Sự cố #123 đã được xử lý',
      time: '15 phút trước',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'Nhắc nhở',
      message: 'Có 3 sự cố đang chờ xử lý',
      time: '1 giờ trước',
      read: true,
      type: 'info'
    }
  ];

  userName: string = 'Admin User';
  userRole: string = 'Administrator';

  ngOnInit(): void {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notifications-container') && !target.closest('.user-menu-container')) {
        this.showNotifications = false;
        this.showUserMenu = false;
      }
    });

    // subscribe to sidebar collapsed state
    this.sidebarSub = this.sidebarService.collapsed$.subscribe(v => {
      this.isCollapsed = v;
    });

    // Update breadcrumbs on route change
    this.updateBreadcrumbs(this.router.url);

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateBreadcrumbs(event.urlAfterRedirects || event.url);
    });
  }

  ngOnDestroy(): void {
    if (this.sidebarSub) this.sidebarSub.unsubscribe();
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  updateBreadcrumbs(url: string): void {
    // Extract path and query params
    const [path, queryString] = url.split('?');
    const queryParams = new URLSearchParams(queryString || '');

    // Reset breadcrumbs based on current URL
    if (path.startsWith('/incidents-by-status')) {
      // Theo trạng thái page
      this.breadcrumbs = [
        { label: 'Quản lý sự cố', url: '/incidents' },
        { label: 'Theo trạng thái', url: '/incidents-by-status' }
      ];
    } else if (path.startsWith('/incidents-by-area')) {
      // Theo khu vực page
      this.breadcrumbs = [
        { label: 'Quản lý sự cố', url: '/incidents' },
        { label: 'Theo khu vực', url: '/incidents-by-area' }
      ];
    } else if (path.startsWith('/incidents')) {
      // Base breadcrumb for incidents section
      const baseBreadcrumb = { label: 'Quản lý sự cố', url: '/incidents' };

      // Check if viewing specific incident detail (e.g., /incidents/123)
      const pathSegments = path.split('/').filter(s => s);
      if (pathSegments.length > 1 && pathSegments[1]) {
        // /incidents/:id - Detail page
        this.breadcrumbs = [
          baseBreadcrumb,
          { label: 'Danh sách sự cố', url: '/incidents' },
          { label: `Chi tiết sự cố #${pathSegments[1]}` }
        ];
      } else if (queryParams.has('status')) {
        // /incidents?status=... - Filter by status
        const status = queryParams.get('status');
        let statusLabel = 'Theo trạng thái';
        if (status === 'new') statusLabel = 'Sự cố mới';
        else if (status === 'processing') statusLabel = 'Đang xử lý';
        else if (status === 'resolved') statusLabel = 'Đã xử lý';

        this.breadcrumbs = [
          baseBreadcrumb,
          { label: statusLabel, url: `/incidents?status=${status}` }
        ];
      } else if (queryParams.has('area')) {
        // /incidents?area=... - Filter by area
        const area = queryParams.get('area');
        this.breadcrumbs = [
          baseBreadcrumb,
          { label: `Khu vực: ${area}` }
        ];
      } else if (queryParams.has('priority')) {
        // /incidents?priority=... - Filter by priority
        const priority = queryParams.get('priority');
        let priorityLabel = 'Theo mức độ';
        if (priority === 'high') priorityLabel = 'Ưu tiên cao';
        else if (priority === 'medium') priorityLabel = 'Ưu tiên trung bình';
        else if (priority === 'low') priorityLabel = 'Ưu tiên thấp';

        this.breadcrumbs = [
          baseBreadcrumb,
          { label: priorityLabel }
        ];
      } else {
        // Default incidents list page
        this.breadcrumbs = [
          baseBreadcrumb,
          { label: 'Danh sách sự cố', url: '/incidents' }
        ];
      }
    } else if (path.startsWith('/incident-types')) {
      // Loại sự cố page
      this.breadcrumbs = [
        { label: 'Danh mục hệ thống', url: '/incident-types' },
        { label: 'Loại sự cố', url: '/incident-types' }
      ];
    } else if (path.startsWith('/areas')) {
      // Khu vực page
      this.breadcrumbs = [
        { label: 'Danh mục hệ thống', url: '/areas' },
        { label: 'Khu vực', url: '/areas' }
      ];
    } else if (path.startsWith('/handler-teams')) {
      // Đội xử lý page
      this.breadcrumbs = [
        { label: 'Danh mục hệ thống', url: '/handler-teams' },
        { label: 'Đội xử lý', url: '/handler-teams' }
      ];
    } else if (path.startsWith('/users')) {
      // Quản lý người dùng page
      this.breadcrumbs = [
        { label: 'Quản lý người dùng', url: '/users' }
      ];
    } else if (path.startsWith('/settings')) {
      // Cấu hình page
      this.breadcrumbs = [
        { label: 'Cấu hình', url: '/settings' }
      ];
    } else if (path.startsWith('/audit-log')) {
      // Nhật ký hệ thống page
      this.breadcrumbs = [
        { label: 'Nhật ký hệ thống', url: '/audit-log' }
      ];
    } else if (path.startsWith('/dashboard')) {
      this.breadcrumbs = [
        { label: 'Dashboard', url: '/dashboard' }
      ];
    } else if (path === '/' || path === '') {
      this.breadcrumbs = [
        { label: 'Dashboard', url: '/dashboard' }
      ];
    } else {
      // Default breadcrumb for unknown routes
      this.breadcrumbs = [
        { label: 'Dashboard', url: '/dashboard' }
      ];
    }
  }

  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // Implement search logic
    }
  }

  navigateToProfile(): void {
    console.log('Navigate to profile');
    // Implement navigation
  }

  changePassword(): void {
    console.log('Navigate to change password');
    // Implement navigation
  }

  logout(): void {
    console.log('Logging out...');
    // Implement logout logic
  }
}
