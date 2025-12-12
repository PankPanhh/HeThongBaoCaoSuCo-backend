import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuditEntry } from './audit-log.model';
import { AuditLogService } from './audit-log.service';

@Component({
  selector: 'app-audit-log-page',
  templateUrl: './audit-log-page.component.html',
  styleUrls: ['./audit-log-page.component.scss']
})
export class AuditLogPageComponent implements OnInit, OnDestroy {
  entries: AuditEntry[] = [];
  filtered: AuditEntry[] = [];
  selected?: AuditEntry | null;
  sub?: Subscription;

  constructor(private svc: AuditLogService) {}

  ngOnInit() {
    this.sub = this.svc.getEntries().subscribe(e => {
      this.entries = e;
      this.filtered = e;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onFilter(f: any) {
    const q = (f.q || '').toLowerCase();
    this.filtered = this.entries.filter(x => {
      const hay = [x.userName, x.userId, x.action, x.target, x.oldValue, x.newValue, x.notes].filter(Boolean).join(' ').toLowerCase();
      if (f.user && !x.userName.includes(f.user) && !x.userId.includes(f.user)) return false;
      if (f.action && !x.action.includes(f.action)) return false;
      if (f.from && x.timestamp < f.from) return false;
      if (f.to && x.timestamp > f.to) return false;
      if (q && !hay.includes(q)) return false;
      return true;
    });
  }

  onView(entry: AuditEntry) {
    this.selected = entry;
  }
}
