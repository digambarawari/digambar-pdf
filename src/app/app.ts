import { Component, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet, Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth-service';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('mypdf');
  router = inject(Router);
  authService = inject(AuthService);
  open = true;

  routeTitle = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => {
        const url = this.router.url;
        switch (true) {
          case url.includes('signup'):
            return 'Signup';
          case url.includes('login'):
            return 'Login';
          default:
            return 'Dashboard';
        }
      })
    ),
    { initialValue: null }
  );

  toggle() {
    this.open = !this.open;
  }
  
  logout() {
    this.authService.logout();
  }
}
