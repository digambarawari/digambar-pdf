import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PdfListDetails } from '../enums/interface';
import { environment } from '../../../environments/environment.development';
import { GLOBAL_CONSTANTS } from '../constants/global.constants';
import { tap } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class PdfService {
  pdfListLoaded = signal(false);
  selectedPdfTitle = signal<string | null>(null);
  selectedPdfUrl = signal<SafeResourceUrl | null>(null);
  // Signal holding the current pdf items
  pdfListDetails: WritableSignal<PdfListDetails[]> = signal<PdfListDetails[]>([]);

  constructor(private http: HttpClient) {}
 
  uploadPdf(formData: FormData) {
    return this.http
      .post<PdfListDetails>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.UPLOAD_PDF, formData)
      .pipe(
        tap(res => {
          console.log('Upload successful:', res);    
          this.addToDashboard(res);            
        })
      );
  }

  getPdfList() {
    return this.http
      .get<PdfListDetails[]>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.PDF_LIST)
      .pipe(
        tap(res => {
          console.log('Get PDF list successful:', res);                   
          this.pdfListDetails.set(res);
          this.pdfListLoaded.set(true);
        })
      );
  }

  addToDashboard(item: PdfListDetails) {
    // Update the new item to the current list
    this.pdfListDetails.update(current => [item, ...current]);
  }
}
