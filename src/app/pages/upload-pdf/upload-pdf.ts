import { Component, signal, computed, inject} from '@angular/core';
import { PdfService } from '../../core/services/pdf-service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-upload-pdf',
  imports: [CommonModule, RouterModule],
  templateUrl: './upload-pdf.html',
  styleUrl: './upload-pdf.css',
})
export class UploadPdf {
  uploading = signal(false);
  error = signal<string | null>(null);
  pdfService = inject(PdfService);
  router = inject(Router);
  // Signals for form fields
  title = signal('');
  description = signal('');
  rating = signal<number | null>(null);
  authorName = signal('');
  tags = signal('');
  selectedFile = signal<File | null>(null);

  // touched flags
  touched = {
    title: signal(false),
    description: signal(false),
    rating: signal(false),
    authorName: signal(false),
    tags: signal(false),
  };

  // Signals for errors
  titleError = computed(() => !this.title() ? 'Title is required' : null);
  descriptionError = computed(() => !this.description() ? 'Description is required' : null);
  ratingError = computed(() => {
    const r = this.rating();
    return r === null || r < 1 || r > 5 ? 'Rating must be between 1 and 5' : null;
  });
  authorError = computed(() => !this.authorName() ? 'Author name is required' : null);
  tagsError = computed(() => !this.tags() ? 'Tags are required' : null);
  fileError = signal<string | null>(null);

  // Computed signal: is form valid?
  isFormValid = computed(() =>
    !this.titleError() &&
    !this.descriptionError() &&
    !this.ratingError() &&
    !this.authorError() &&
    !this.tagsError() &&
    !!this.selectedFile() &&
    !this.fileError()
  );

  onFieldInputChange(event: Event, field: 'title' | 'description' | 'rating' | 'authorName' | 'tags') {
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
      case 'authorName':
        this.authorName.set(value);
        break;
      case 'tags':
        this.tags.set(value);
        break;
    }
  }


  onPdfFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    // Validate file size (max 2MB) and type (PDF)
    if (file.size > 2 * 1024 * 1024) {
      this.fileError.set('File size exceeds 2MB');
      this.selectedFile.set(null);
      return;
    }
    // Validate file type
    if (file.type !== 'application/pdf') {
      this.fileError.set('Only PDF files are allowed');
      this.selectedFile.set(null);
      return;
    }
    // Clear errors and set selected file
    this.fileError.set(null);
    this.selectedFile.set(file);
  }

  onPdfSubmit(event: Event) {
    event.preventDefault();
    if (!this.isFormValid()) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile()!);
    formData.append('title', this.title());
    formData.append('description', this.description());
    formData.append('rating', this.rating()!.toString());
    formData.append('authorName', this.authorName());
    formData.append('tags', this.tags());

    // pdf upload service
    this.uploading.set(true);
    this.pdfService.uploadPdf(formData).subscribe({
      next: () => {
        this.uploading.set(false);
        console.log('PDF uploaded successfully');
        // Reset signal of form elements and navigate to pdf dashboard
        this.title.set('');
        this.error.set(null);
        this.description.set('');
        this.rating.set(null);
        this.authorName.set('');
        this.tags.set('');
        this.selectedFile.set(null);
        this.router.navigate(['/dashboard']);// Navigate to pdf dashboard
      },
      error: (err) => {
        this.uploading.set(false);
        this.error.set(err.error?.message || 'Pdf Upload failed');
      }
    });

    
  } 
}
