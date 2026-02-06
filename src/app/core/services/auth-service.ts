import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { GLOBAL_CONSTANTS } from '../constants/global.constants';
import { LoginResponse, LoginRequest, SignupRequest } from '../enums/interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';
  private usernameKey = 'username';

  isLoggedIn = signal<boolean>(!!this.token);
  username = signal<string|null>(localStorage.getItem(this.usernameKey));

  constructor(private http: HttpClient, private router: Router) {}

  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  get usernames() {
    return localStorage.getItem(this.usernameKey);
  }

  login(loginRequest: LoginRequest) {
    return this.http
      .post<LoginResponse>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.LOGIN, loginRequest)
      .pipe(
        tap(res => {
          console.log('Login successful:', res);
          localStorage.setItem(this.tokenKey, res.accessToken);
          if(res.userfname && res.userlname) {
            localStorage.setItem(this.usernameKey, res.userfname+' '+res.userlname);
            this.username.set(res.userfname+' '+res.userlname);  
          } else {
            localStorage.setItem(this.usernameKey, GLOBAL_CONSTANTS.DEFAULT_USERNAME);
            this.username.set(GLOBAL_CONSTANTS.DEFAULT_USERNAME);
          }
          this.isLoggedIn.set(true);
          
        })
      );
  }

  signup(SignupRequest: SignupRequest) {
    return this.http
      .post<LoginResponse>(environment.API_URL + GLOBAL_CONSTANTS.API_ENPOINT.SIGNUP, SignupRequest)
      .pipe(
        tap(res => {
          console.log('Sign successful:', res);          
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.isLoggedIn.set(false);
    this.username.set(null);
    console.log('Logged out successfully', this.isLoggedIn(), this.username());
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
