import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuditEntry } from './audit-log.model';

@Component({
  selector: 'app-audit-log-table',
  templateUrl: './audit-log-table.component.html',
  styleUrls: ['./audit-log-table.component.scss']
})
export class AuditLogTableComponent {
  @Input() entries: AuditEntry[] = [];
  @Output() view = new EventEmitter<AuditEntry>();
}
