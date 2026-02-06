import { Component } from '@angular/core';
import { PdfService } from '../../core/services/pdf-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  constructor(public pdfService: PdfService) {
    if(!this.pdfService.pdfListLoaded()) {
      this.pdfService.getPdfList().subscribe();
    }
  }

  getTagNames(tags: {id: string, name: string }[]): string {
    return tags.map(tag => tag.name).join(', ');
  }

}
