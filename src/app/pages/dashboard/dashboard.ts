import { Component } from '@angular/core';
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
  constructor(public pdfService: PdfService, private sanitizer: DomSanitizer, private router: Router) {
    if(!this.pdfService.pdfListLoaded()) {
      this.pdfService.getPdfList().subscribe();
    }
  }

  getTagNames(tags: {id: string, name: string }[]): string {
    return tags.map(tag => tag.name).join(', ');
  }

  setPdfUrl(url: string, title: string) {
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.pdfService.selectedPdfUrl.set(safeUrl);
    this.pdfService.selectedPdfTitle.set(title);
  }

}
