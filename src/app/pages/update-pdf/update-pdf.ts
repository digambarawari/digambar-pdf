import { Component, signal, computed, inject, AfterViewInit} from '@angular/core';
import { PdfService } from '../../core/services/pdf-service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UpdatePdfDetails } from '../../core/enums/interface';

@Component({
  selector: 'app-update-pdf',
  imports: [CommonModule, RouterModule],
  templateUrl: './update-pdf.html',
  styleUrl: './update-pdf.css',
})
export class UpdatePdf implements AfterViewInit{
  updating = signal(false);
  error = signal<string | null>(null);
  pdfService = inject(PdfService);
  router = inject(Router);
  // Signals for form fields
  title = signal('');
  description = signal('');
  rating = signal<number | null>(null);

  // touched flags
  touched = {
    title: signal(false),
    description: signal(false),
    rating: signal(false)
  };

  // Signals for errors
  titleError = computed(() => !this.title() ? 'Title is required' : null);
  descriptionError = computed(() => !this.description() ? 'Description is required' : null);
  ratingError = computed(() => {
    const r = this.rating();
    return r === null || r < 1 || r > 5 ? 'Rating must be between 1 and 5' : null;
  });

  // Computed signal: is form valid?
  isFormValid = computed(() =>
    !this.titleError() &&
    !this.descriptionError() &&
    !this.ratingError()
  );

  ngAfterViewInit(): void {
    const editPdfId = this.pdfService.editPdfId();
    if (editPdfId) {
      const pdfToEdit = this.pdfService.pdfListDetailSig().find(pdf => pdf.id === editPdfId); 
      if (pdfToEdit) {
        this.title.set(pdfToEdit.title);
        this.description.set(pdfToEdit.description);
        this.rating.set(pdfToEdit.rating);
      }
    } else {
      // If no PDF is selected for editing, navigate back to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  onFieldInputChange(event: Event, field: 'title' | 'description' | 'rating') {
    const value = (event.target as HTMLInputElement).value;
    this.touched[field].set(true);
    switch (field) {
      case 'title':
        this.title.set(value);
        break;
      case 'description':
        this.description.set(value);
        break;
      case 'rating':
        this.rating.set(Number(value));
        break;
    }
  }

  onPdfSubmit(event: Event) {
    event.preventDefault();
    if (!this.isFormValid()) return;

    const updatePdf: UpdatePdfDetails = {
      title: this.title(),
      description: this.description(),
      rating: this.rating()!
    };

    // pdf upload service
    this.updating.set(true);
    this.pdfService.updatePdf(updatePdf).subscribe({
      next: () => {
        this.updating.set(false);
        console.log('PDF updated successfully');
        // Reset signal of form elements and navigate to pdf dashboard
        this.title.set('');
        this.error.set(null);
        this.description.set('');
        this.rating.set(null);
        // Navigate to dashboard after successful upload
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.updating.set(false);
        this.error.set(err.error?.message || 'Pdf Update failed');
      }
    });

    
  } 
}
