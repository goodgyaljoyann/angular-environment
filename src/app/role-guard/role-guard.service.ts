import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  constructor(private authService: AuthService,
     private router: Router) {}
  
  //Grants access only if user is logged in/authenticated
  canActivate(): boolean {
    const isAdmin = this.authService.isAdmin();
    if (isAdmin) {
      return true; // Allow access to the route if the user is an admin
    } else {
      this.router.navigate(['/login-admin']); // Redirect to login-admin if not admin
      return false; // Deny access to the route if the user is not an admin
    }
  }
}
