import { Component, OnInit } from '@angular/core';
import { SidebarService } from './sidebar.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = false;
  constructor(private sidebarService: SidebarService) {}
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Quản lý sự cố',
      icon: 'warning',
      expanded: false,
      children: [
        {
          label: 'Danh sách sự cố',
          icon: 'list',
          route: '/incidents'
        },
        {
          label: 'Theo trạng thái',
          icon: 'filter_list',
          route: '/incidents/by-status'
        },
        {
          label: 'Theo khu vực',
          icon: 'location_on',
          route: '/incidents/by-area'
        }
      ]
    },
    {
      label: 'Danh mục hệ thống',
      icon: 'category',
      expanded: false,
      children: [
        {
          label: 'Loại sự cố',
          icon: 'label',
          route: '/incident-types'
        },
        {
          label: 'Khu vực',
          icon: 'map',
          route: '/areas'
        },
        {
          label: 'Đội xử lý',
          icon: 'groups',
          route: '/handler-teams'
        }
      ]
    },
    {
      label: 'Quản lý người dùng',
      icon: 'people',
      route: '/users'
    },
    {
      label: 'Cấu hình',
      icon: 'settings',
      route: '/settings'
    },
    {
      label: 'Nhật ký hệ thống',
      icon: 'history',
      route: '/audit-log'
    }
  ];

  ngOnInit(): void {
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      this.isCollapsed = JSON.parse(savedState);
      // sync initial state to service
      this.sidebarService.setCollapsed(this.isCollapsed);
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('sidebar-collapsed', JSON.stringify(this.isCollapsed));
    // notify other components
    this.sidebarService.setCollapsed(this.isCollapsed);
  }

  toggleMenuItem(item: MenuItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  isActiveRoute(route?: string): boolean {
    if (!route) return false;
    return window.location.pathname === route;
  }
}
