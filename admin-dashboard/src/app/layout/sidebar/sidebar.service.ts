import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this.collapsedSubject.asObservable();

  private expandMenuSubject = new BehaviorSubject<string | null>(null);
  expandMenu$ = this.expandMenuSubject.asObservable();

  setCollapsed(collapsed: boolean) {
    this.collapsedSubject.next(collapsed);
  }

  toggle() {
    this.collapsedSubject.next(!this.collapsedSubject.getValue());
  }

  isCollapsed(): boolean {
    return this.collapsedSubject.getValue();
  }

  expandMenu(menuLabel: string) {
    this.expandMenuSubject.next(menuLabel);
  }

  openSidebarAndExpandMenu(menuLabel: string) {
    this.setCollapsed(false);
    this.expandMenu(menuLabel);
  }
}
