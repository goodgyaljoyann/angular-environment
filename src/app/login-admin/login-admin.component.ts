import { Component } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  constructor(private authService: AuthService, private router:Router) {}
  
  onLogin(form: any) {
    if (form.valid) {
      this.authService.loginAdmin(form.value).subscribe(
        response => {
          console.log('Login successful', response);
          if (response && response.admin_id) {
            // Assuming the response contains the user's data including the admin_id
            const adminId = response.admin_id;
            // Save the admin_id as a cookie or in localStorage
            localStorage.setItem('admin_id', adminId);
            // Check if the logged-in user is an admin
            if (this.authService.isAdmin()) {
              // Redirect to the admin dashboard
              this.router.navigate(['/dashboard']);
            } else {
              console.error('Login failed: User is not an admin');
            }
          } else {
            console.error('Login failed: Response is missing admin_id');
          }
        },
        error => {
          console.error('Login failed', error);
        }
      );
    }
  }
}