import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-audit-log-filter',
  templateUrl: './audit-log-filter.component.html',
  styleUrls: ['./audit-log-filter.component.scss']
})
export class AuditLogFilterComponent {
  @Output() filterChange = new EventEmitter<any>();

  q = '';
  user = '';
  action = '';
  from = '';
  to = '';

  apply() {
    this.filterChange.emit({ q: this.q, user: this.user, action: this.action, from: this.from, to: this.to });
  }

  reset() {
    this.q = this.user = this.action = this.from = this.to = '';
    this.apply();
  }
}
