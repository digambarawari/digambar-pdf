import { Routes } from '@angular/router';
import { UpdatePdf } from './update-pdf';
import { AuthGuard } from '../../core/guards/auth.guard';

export const updatePdfRoutes: Routes = [
  {
    path: '',
    component: UpdatePdf,
    canActivate: [AuthGuard],
    children: [
      { path: 'updatepdf', component: UpdatePdf }
    ]
  }
];
