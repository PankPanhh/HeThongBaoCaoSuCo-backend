import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarService } from './sidebar.service';
import { filter } from 'rxjs/operators';

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
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isCollapsed: boolean = false;
  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {}
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'Quản lý sự cố',
      icon: 'warning',
      expanded: false,
      children: [
        {
          label: 'Danh sách sự cố',
          icon: 'list',
          route: '/incidents',
        },
        {
          label: 'Theo trạng thái',
          icon: 'filter_list',
          route: '/incidents-by-status',
        },
        {
          label: 'Theo khu vực',
          icon: 'location_on',
          route: '/incidents-by-area',
        },
      ],
    },
    {
      label: 'Danh mục hệ thống',
      icon: 'category',
      expanded: false,
      children: [
        {
          label: 'Loại sự cố',
          icon: 'label',
          route: '/incident-types',
        },
        {
          label: 'Khu vực',
          icon: 'map',
          route: '/areas',
        },
        {
          label: 'Đội xử lý',
          icon: 'groups',
          route: '/handler-teams',
        },
      ],
    },
    {
      label: 'Quản lý người dùng',
      icon: 'people',
      route: '/users',
    },
    {
      label: 'Quản lý tin tức',
      icon: 'article',
      route: '/news',
    },
    {
      label: 'Cấu hình',
      icon: 'settings',
      route: '/settings',
    },
    {
      label: 'Nhật ký hệ thống',
      icon: 'history',
      route: '/audit-log',
    },
  ];

  ngOnInit(): void {
    // Load collapsed state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      this.isCollapsed = JSON.parse(savedState);
      // sync initial state to service
      this.sidebarService.setCollapsed(this.isCollapsed);
    }

    // Auto-expand parent menu when child route is active
    this.autoExpandActiveMenu();

    // Subscribe to router events to auto-expand on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.autoExpandActiveMenu();
    });

    // Subscribe to expand menu events
    this.sidebarService.expandMenu$.subscribe(menuLabel => {
      if (menuLabel) {
        const menuItem = this.menuItems.find(item => item.label === menuLabel);
        if (menuItem && menuItem.children) {
          menuItem.expanded = true;
        }
      }
    });

    // Subscribe to collapsed state changes
    this.sidebarService.collapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    });
  }

  autoExpandActiveMenu(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child =>
          child.route && currentRoute.includes(child.route)
        );
        if (hasActiveChild) {
          item.expanded = true;
        }
      }
    });
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
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  isParentActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => this.isActiveRoute(child.route));
  }
}
