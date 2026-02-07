import { Component, signal } from '@angular/core';
import { PdfService } from '../../core/services/pdf-service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  isDeleteConfirmOpen = signal<boolean>(false);
  selecetedPdfId = signal<string | null>(null);

  constructor(public pdfService: PdfService, private sanitizer: DomSanitizer, private router: Router) {
    this.pdfService.editPdfId.set(null);
    //Check for pdf list loaded if loaded then get it from localstorage
    if(!this.pdfService.pdfListLoaded() && !localStorage.getItem('pdfList')) {
      this.pdfService.getPdfList().subscribe();
    } else if (localStorage.getItem('pdfList')) {
      if(this.pdfService.searchTerm() !== '') {
        let serchVal = this.pdfService.searchTerm();
        //search pdf with title, author, description, tag and update pdf list
        this.pdfService.pdfListDetailSig.update(current => {
          return current.filter(pdf => 
            this.secureLower(pdf.title).includes(serchVal) ||
            this.secureLower(pdf.description).includes(serchVal) ||
            this.secureLower(pdf.author.name).includes(serchVal) ||
            this.getTagNames(pdf.tags).toLowerCase().includes(serchVal)
          );
        });
      } else {
        this.pdfService.pdfMainListDetails.set(JSON.parse(localStorage.getItem('pdfList') || '[]'));
        this.pdfService.pdfListDetailSig.set(this.pdfService.pdfMainListDetails());
        this.pdfService.pdfListLoaded.set(true);
      }
    } else {
      this.pdfService.getPdfList().subscribe();
    }
  }
  //get tag value to be concat format
  getTagNames(tags: {id: string, name: string }[]): string {
    return tags.map(tag => tag.name).join(', ');
  }
  //Set pdf url for view pdf component
  setPdfUrl(url: string, title: string, author: string) {
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.pdfService.selectedPdfUrl.set(safeUrl);
    this.pdfService.selectedPdfTitle.set(title);
    this.pdfService.selectedPdfAuthor.set(author);
  }

  //Secure lowercase for search to avoid null and undefined search
  secureLower(str: string | null | undefined): string {
    return (str ?? '').toLowerCase().trim();
  }

  // Update pdf list with search value
  onSearchPdf(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.pdfService.searchTerm.set(value);
    //check for empty search and reset the pdf list
    const term = this.secureLower(this.pdfService.searchTerm());
    if (!term) {
      this.pdfService.pdfListDetailSig.set(this.pdfService.pdfMainListDetails()); 
      return;
    }
    //search pdf with title, author, description, tag and update pdf list
    this.pdfService.pdfListDetailSig.update(current => {
      return current.filter(pdf => 
        this.secureLower(pdf.title).includes(term) ||
        this.secureLower(pdf.description).includes(term) ||
        this.secureLower(pdf.author.name).includes(term) ||
        this.getTagNames(pdf.tags).toLowerCase().includes(term)
      );
    });
  }

  // Delete PDF from dashboard
  deletePdf() {
    let pdfId = this.selecetedPdfId();
    if(pdfId !== null) {
      this.pdfService.deletePdf(pdfId).subscribe(() => {
        this.selecetedPdfId.set(null);
        this.removePdfFromDashboard(pdfId);
      });
    }
  }

  updatePdfDetails(pdfId: string) {
    this.pdfService.editPdfId.set(pdfId);
    this.router.navigate(['/updatepdf']);
  }

  // Remove PDF from dashboard lists and localStorage after successful delete API call
  removePdfFromDashboard(pdfId: string) {
    // Remove the PDF from both main and working lists
    this.pdfService.pdfListDetailSig.update(current => current.filter(pdf => pdf.id !== pdfId));
    this.pdfService.pdfMainListDetails.update(current => current.filter(pdf => pdf.id !== pdfId));
    // Update localStorage with the new lists
    localStorage.setItem('pdfList', JSON.stringify(this.pdfService.pdfMainListDetails()));
  }

  // Open confirmation dialog before deleting PDF
  openConfirm(pdfId: string) {
    this.selecetedPdfId.set(pdfId);
    this.isDeleteConfirmOpen.set(true);
  }
  // Close confirmation dialog
  closeConfirm() {
    this.isDeleteConfirmOpen.set(false);
  }
  // Confirm delete action and call delete API
  confirmDelete() {
    this.closeConfirm();
    this.deletePdf();
  }

}



