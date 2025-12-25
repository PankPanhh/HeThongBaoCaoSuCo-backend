import { Component, Input } from '@angular/core';
import { AuditEntry } from './audit-log.model';

@Component({
  selector: 'app-audit-log-detail',
  templateUrl: './audit-log-detail.component.html',
  styleUrls: ['./audit-log-detail.component.scss']
})
export class AuditLogDetailComponent {
  @Input() entry?: AuditEntry | null;
}
