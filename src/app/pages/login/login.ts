import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { RouterModule } from '@angular/router';
import { LoginRequest } from '../../core/enums/interface';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  error = signal<string | null>(null);
  constructor(private auth: AuthService, private router: Router) {
    //if user already logged in, redirect to dashboard
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Login form fields
  loading = signal(false);
  email = signal('');
  password = signal('');

  // signal interaction state
  touched = signal({
    email: false,
    password: false
  });

  // email validations
  emailError = computed(() => {
    if (!this.touched().email) return null;
    if (!this.email()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(this.email())) return 'Invalid email';
    return null;
  });
  // password validations
  passwordError = computed(() => {
    if (!this.touched().password) return null;
    if (!this.password()) return 'Password is required';
    if (this.password().length < 8) return 'Minimum 8 characters';
    return null;
  });

  // form validity
  isValid = computed(() =>
    !this.emailError() && !this.passwordError()
  );
  // submit login form
  submit(event: Event) {
    event.preventDefault();
    if (!this.isValid()) return;
    this.loading.set(true);
    // Create login request object
    const loginRequest: LoginRequest = {
      email: this.email(),
      password: this.password()
    };
    // Call auth service to login
    this.auth.login(loginRequest).subscribe({
      next: () => {
        console.log('Login successful');
        this.auth.authme().subscribe();
        this.loading.set(false);
        // Redirect to dashboard on successful login
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed');
      }
    });
  }
}

