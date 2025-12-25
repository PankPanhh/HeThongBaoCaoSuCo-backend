import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private collapsedSubject = new BehaviorSubject<boolean>(false);
  collapsed$ = this.collapsedSubject.asObservable();

  setCollapsed(collapsed: boolean) {
    this.collapsedSubject.next(collapsed);
  }

  toggle() {
    this.collapsedSubject.next(!this.collapsedSubject.getValue());
  }

  isCollapsed(): boolean {
    return this.collapsedSubject.getValue();
  }
}
