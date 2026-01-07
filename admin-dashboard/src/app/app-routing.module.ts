import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuditLogPageComponent } from './pages/auditlog/audit-log-page.component';
import { IncidentsListComponent } from './pages/incidents/incidents-list.component';
import { IncidentsByStatusComponent } from './pages/incidents/incidents-by-status.component';
import { IncidentsByAreaComponent } from './pages/incidents/incidents-by-area.component';
import { SettingComponent } from './pages/setting/setting.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'audit-log',
        component: AuditLogPageComponent,
      },
      {
        path: 'incidents',
        component: IncidentsListComponent,
      },
      {
        path: 'incidents-by-status',
        component: IncidentsByStatusComponent,
      },
      {
        path: 'incidents-by-area',
        component: IncidentsByAreaComponent,
      },
      {
        path: 'settings',
        component: SettingComponent,
      },
      // Add more routes here as you create more pages
      // {
      //   path: 'incidents',
      //   component: IncidentsComponent
      // },
      // {
      //   path: 'users',
      //   component: UsersComponent
      // }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
