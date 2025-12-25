import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  showNotifications: boolean = false;
  showUserMenu: boolean = false;
  isCollapsed: boolean = false;
  private sidebarSub?: Subscription;

  constructor(private sidebarService: SidebarService) {}

  breadcrumbs: Breadcrumb[] = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Sự cố', url: '/incidents' }
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
  }

  ngOnDestroy(): void {
    if (this.sidebarSub) this.sidebarSub.unsubscribe();
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
