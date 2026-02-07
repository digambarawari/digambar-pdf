import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { GLOBAL_CONSTANTS } from '../constants/global.constants';
import { LoginResponse, LoginRequest, SignupRequest, AuthMeResponse } from '../enums/interface';
import { PdfService } from './pdf-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';
  private usernameKey = 'username';

  isLoggedIn = signal<boolean>(!!this.token);
  username = signal<string|null>(localStorage.getItem(this.usernameKey));

  constructor(private http: HttpClient, private router: Router, private pdfService: PdfService) {}
  //getter function
  get token() {
    return localStorage.getItem(this.tokenKey);
  }
  //getter function
  get usernames() {
    return localStorage.getItem(this.usernameKey);
  }
  //Login API call
  login(loginRequest: LoginRequest) {
    return this.http
      .post<LoginResponse>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.LOGIN, loginRequest)
      .pipe(
        tap(res => {
          // successfull login
          localStorage.setItem(this.tokenKey, res.accessToken);
          this.isLoggedIn.set(true);          
        })
      );
  }
  //Auth me API call to get the user details after login
  authme() {
    return this.http
      .get<AuthMeResponse>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.AUTH_ME)
      .pipe(
        tap(res => {
          // set username with auth me details
          if(res.firstName && res.lastName) {
            localStorage.setItem(this.usernameKey, res.firstName+' '+res.lastName);
            this.username.set(res.firstName+' '+res.lastName);  
          } else {
            localStorage.setItem(this.usernameKey, GLOBAL_CONSTANTS.DEFAULT_USERNAME);
            this.username.set(GLOBAL_CONSTANTS.DEFAULT_USERNAME);
          }
        })
      );
  }
  //Sign up API call
  signup(SignupRequest: SignupRequest) {
    return this.http
      .post<LoginResponse>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.SIGNUP, SignupRequest)
      .pipe(
        tap(res => {
          // successfully sign up         
        })
      );
  }
  //Logout function to clear local storage and reset signals
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.isLoggedIn.set(false);
    this.username.set(null);
    this.pdfService.pdfListLoaded.set(false);
    this.pdfService.selectedPdfUrl.set(null);
    this.pdfService.selectedPdfTitle.set(null);
    this.pdfService.selectedPdfAuthor.set(null);
    localStorage.removeItem('pdfList');
    console.log('Logged out successfully');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
