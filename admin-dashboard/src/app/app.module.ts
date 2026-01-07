import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Layout Components
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';

// Page Components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditLogPageComponent } from './pages/auditlog/audit-log-page.component';
import { AuditLogFilterComponent } from './pages/auditlog/audit-log-filter.component';
import { AuditLogTableComponent } from './pages/auditlog/audit-log-table.component';
import { AuditLogDetailComponent } from './pages/auditlog/audit-log-detail.component';
import { IncidentsByAreaComponent } from './pages/incidents/incidents-by-area.component';
import { IncidentsByStatusComponent } from './pages/incidents/incidents-by-status.component';
import { IncidentsListComponent } from './pages/incidents/incidents-list.component';
import { SettingComponent } from './pages/setting/setting.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    AuditLogPageComponent,
    AuditLogFilterComponent,
    AuditLogTableComponent,
    AuditLogDetailComponent,
    SettingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Material Modules
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    // Standalone Components
    IncidentsByAreaComponent,
    IncidentsByStatusComponent,
    IncidentsListComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
