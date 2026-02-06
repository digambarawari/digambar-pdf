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
  searchTerm = signal<string>('');
  constructor(public pdfService: PdfService, private sanitizer: DomSanitizer, private router: Router) {
    if(!this.pdfService.pdfListLoaded()) {
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
    this.searchTerm.set(value);
    //check for empty search and reset the pdf list
    const term = this.secureLower(this.searchTerm());
    if (!term) {
      this.pdfService.pdfListDetails.set(this.pdfService.pdfMainListDetails()); 
      return;
    }
    //search pdf with title, author, description, tag and update pdf list
    this.pdfService.pdfListDetails.update(current => {
      return current.filter(pdf => 
        this.secureLower(pdf.title).includes(term) ||
        this.secureLower(pdf.description).includes(term) ||
        this.secureLower(pdf.author.name).includes(term) ||
        this.getTagNames(pdf.tags).toLowerCase().includes(term)
      );
    });
  }

}



