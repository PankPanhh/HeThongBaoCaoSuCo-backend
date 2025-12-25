import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from './sidebar/sidebar.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed: boolean = false;
  private sidebarSub?: Subscription;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarSub = this.sidebarService.collapsed$.subscribe(v => this.isSidebarCollapsed = v);
  }

  ngOnDestroy(): void {
    if (this.sidebarSub) this.sidebarSub.unsubscribe();
  }
}
