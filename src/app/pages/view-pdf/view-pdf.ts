import { Component } from '@angular/core';
import { PdfService } from '../../core/services/pdf-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-pdf',
  imports: [CommonModule, RouterModule],
  templateUrl: './view-pdf.html',
  styleUrl: './view-pdf.css',
})
export class ViewPdf {
  constructor(public pdfService: PdfService) { }

  closePdf() {
    this.pdfService.selectedPdfUrl.set(null);
    this.pdfService.selectedPdfTitle.set(null);
    this.pdfService.selectedPdfAuthor.set(null);
  }
}
