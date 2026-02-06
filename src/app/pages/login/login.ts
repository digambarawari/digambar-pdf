import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  /*loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  router = inject(Router);

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;

    const loginRequest: LoginRequest = {
      email,
      password
    };

    this.auth.login(loginRequest).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);// Navigate to dashboard
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed';
      }
    });
  }*/
  //---------------------------------------
  router = inject(Router);
  auth = inject(AuthService);
  error: string | null = null;
  // Login form fields
  loading = signal(false);
  email = signal('');
  password = signal('');

  // interaction state
  touched = signal({
    email: false,
    password: false
  });

  // validations
  emailError = computed(() => {
    if (!this.touched().email) return null;
    if (!this.email()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(this.email())) return 'Invalid email';
    return null;
  });

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

  submit(event: Event) {
    event.preventDefault();
    if (!this.isValid()) return;
    this.loading.set(true);

    const loginRequest: LoginRequest = {
      email: this.email(),
      password: this.password()
    };

    this.auth.login(loginRequest).subscribe({
      next: () => {
        console.log('Login successful');
        this.loading.set(false);
        this.router.navigate(['/dashboard']);// Navigate to dashboard
      },
      error: (err) => {
        this.loading.set(false);
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
}

