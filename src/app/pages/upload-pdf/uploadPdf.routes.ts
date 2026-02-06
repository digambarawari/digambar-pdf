import { Routes } from '@angular/router';
import { UploadPdf } from './../upload-pdf/upload-pdf';
import { AuthGuard } from '../../core/guards/auth.guard';

export const uploadPdfRoutes: Routes = [
  {
    path: '',
    component: UploadPdf,
    canActivate: [AuthGuard],
    children: [
      { path: 'uploadpdf', component: UploadPdf }
    ]
  }
];
