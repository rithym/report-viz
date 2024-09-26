import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service'; // Import your authentication service

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    // Check if the user is authenticated (e.g., by verifying the presence of a JWT token)
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // If not authenticated, redirect to the login page
      return this.router.parseUrl('/login');
    }
  }
}
