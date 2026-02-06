import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SignupRequest } from '../../core/enums/interface';
import { passwordMatchValidator } from '../../core/helpers/passwordMatch';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  selector: 'app-signup-component',
  templateUrl: './signup-component.html',
  styleUrl: './signup-component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error: string | null = null;
  
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    if (auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator });
  }

  submit() {
    if (this.signupForm.invalid) return;
    
    this.loading = true;
    this.error = null;

    const { email, password, passwordConfirmation, firstName, lastName } = this.signupForm.value;

    const signupRequest: SignupRequest = {
      email,
      password,
      passwordConfirmation,
      firstName,
      lastName
    };

    this.auth.signup(signupRequest).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);// Navigate to login page after successful signup
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Signup failed';
      }
    });
  }
}
