import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PdfListDetails } from '../enums/interface';
import { environment } from '../../../environments/environment.development';
import { GLOBAL_CONSTANTS } from '../constants/global.constants';
import { tap } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class PdfService {
  //Search signal
  searchTerm = signal<string>('');
  //Singal to show the pdf list fetch from server only once. will reset after logout
  pdfListLoaded = signal(false);
  //Signal to show on view pdf page
  selectedPdfTitle = signal<string | null>(null);
  selectedPdfAuthor = signal<string | null>(null);
  selectedPdfUrl = signal<SafeResourceUrl | null>(null);
  // Signal with pdf list to restore main list
  pdfMainListDetails: WritableSignal<PdfListDetails[]> = signal<PdfListDetails[]>([]);
  // Signal with pdf list for manipulation
  pdfListDetails: WritableSignal<PdfListDetails[]> = signal<PdfListDetails[]>([]);

  constructor(private http: HttpClient) {}
  //API for upload pdf list
  uploadPdf(formData: FormData) {
    return this.http
      .post<PdfListDetails>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.UPLOAD_PDF, formData)
      .pipe(
        tap(res => {
          console.log('PDF Upload successful to server');    
          this.addToDashboard(res);            
        })
      );
  }
  //API to get PDF list
  getPdfList() {
    return this.http
      .get<PdfListDetails[]>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.PDF_LIST)
      .pipe(
        tap(res => {
          console.log('Get PDF list successful from API');                   
          this.pdfMainListDetails.set(res);
          this.pdfListDetails.set(res);
          this.pdfListLoaded.set(true);
          localStorage.setItem('pdfList', JSON.stringify(res));
        })
      );
  }
  // Delete PDF API call
  deletePdf(pdfId: string) {
    console.log('pdfid',pdfId);
    return this.http
      .delete<{ message: string }>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.DELETE_PDF + `/${pdfId}`) 
      .pipe(
        tap(res => {
          console.log(`PDF with ID ${pdfId} deleted from server: ${res}`);                   
        })
      );
  }
  
  // Update uploaded pdf in main and working pdf list
  addToDashboard(item: PdfListDetails) {
    this.pdfListDetails.update(current => [item, ...current]);
    this.pdfMainListDetails.update(current => [item, ...current]);
  }
}
