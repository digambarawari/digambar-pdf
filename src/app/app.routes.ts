import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup-component';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];