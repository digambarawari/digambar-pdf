import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PdfListDetails, UpdatePdfDetails } from '../enums/interface';
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
  editPdfId = signal<string | null>(null);
  //Signal to show on view pdf page
  selectedPdfTitle = signal<string | null>(null);
  selectedPdfAuthor = signal<string | null>(null);
  selectedPdfUrl = signal<SafeResourceUrl | null>(null);
  // Signal with pdf list to restore main list
  pdfMainListDetails: WritableSignal<PdfListDetails[]> = signal<PdfListDetails[]>([]);
  // Signal with pdf list for manipulation
  pdfListDetailSig: WritableSignal<PdfListDetails[]> = signal<PdfListDetails[]>([]);

  constructor(private http: HttpClient) {}
  //API for upload pdf list
  uploadPdf(formData: FormData) {
    return this.http
      .post<PdfListDetails>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.UPLOAD_PDF, formData)
      .pipe(
        tap(res => {
          console.log('PDF Upload successful to server');    
        })
      );
  }
  //API for update pdf details
  updatePdf(updatePdfDtls: UpdatePdfDetails) {
    return this.http
      .patch(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.UPDATE_PDF + `/${this.editPdfId()}`, updatePdfDtls)
      .pipe(
        tap(res => {
          //update pdf list with updated details
          this.pdfListDetailSig.update(current => {
            return current.map(pdf => {
              if (pdf.id === this.editPdfId()) {
                return { ...pdf, ...updatePdfDtls };
              }
              return pdf;
            });
          });
          //update main list with updated details
          this.pdfMainListDetails.update(current => {
            return current.map(pdf => {
              if (pdf.id === this.editPdfId()) {
                return { ...pdf, ...updatePdfDtls };
              }
              return pdf;
            });
          });
          //update localstorage with updated details
          localStorage.setItem('pdfList', JSON.stringify(this.pdfMainListDetails()));
          this.editPdfId.set(null);
        }));
  }

  //API to get PDF list
  getPdfList() {
    return this.http
      .get<PdfListDetails[]>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.PDF_LIST)
      .pipe(
        tap(res => {
          console.log('Get PDF list successful from API');                   
          this.pdfMainListDetails.set(res);
          this.pdfListDetailSig.set(res);
          this.pdfListLoaded.set(true);
          localStorage.setItem('pdfList', JSON.stringify(res));
        })
      );
  }
  // Delete PDF API call
  deletePdf(pdfId: string) {
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
    this.pdfListDetailSig.update(current => [item, ...current]);
    this.pdfMainListDetails.update(current => [item, ...current]);
    localStorage.setItem('pdfList', JSON.stringify(this.pdfMainListDetails()));
  }
}
