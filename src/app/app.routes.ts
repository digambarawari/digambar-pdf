import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },
  { 
    path: 'uploadpdf',
    loadChildren: () =>
      import('./pages/upload-pdf/uploadPdf.routes').then(m => m.uploadPdfRoutes)
  },
  { path: 'signup', 
    loadChildren: () => 
      import('./pages/signup/signup.routes').then(m => m.signupRoutes) 
  },
  { path: 'login', 
    loadChildren: () =>
      import('./pages/login/login.routes').then(m => m.loginRoutes) 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];