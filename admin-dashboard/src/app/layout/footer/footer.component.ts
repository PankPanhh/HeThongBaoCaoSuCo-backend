import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  isCollapsed: boolean = false;
  private sidebarSub?: Subscription;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarSub = this.sidebarService.collapsed$.subscribe(v => this.isCollapsed = v);
  }

  ngOnDestroy(): void {
    if (this.sidebarSub) this.sidebarSub.unsubscribe();
  }
}
