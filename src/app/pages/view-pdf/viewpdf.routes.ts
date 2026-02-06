import { Routes } from '@angular/router';
import { ViewPdf } from './view-pdf';
import { AuthGuard } from '../../core/guards/auth.guard';

export const viewPdfRoutes: Routes = [
  {
    path: '',
    component: ViewPdf,
    canActivate: [AuthGuard],
    children: [
      { path: 'viewpdf', component: ViewPdf },
    ]
  }
];
