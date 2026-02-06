import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { AuthGuard } from '../../core/guards/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: '',
    component: Dashboard,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard }
    ]
  }
];
