import { Component } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private authService: AuthService, private router:Router) {}

  onLogin(form: any) {
    if (form.valid) {
      this.authService.loginUser(form.value).subscribe(
        response => {
          console.log('Login successful', response);
          if (response && response.customer_id) {
            // Assuming the response contains the user's data including the customer_id
            const customerId = response.customer_id;
            // Save the customer_id as a cookie or in localStorage
            localStorage.setItem('customer_id', customerId);
            // Redirect to a secure page after successful login
            this.router.navigate(['/']);
          } else {
            console.error('Login failed: Response is missing customer_id');
          }
        },
        error => {
          console.error('Login failed', error);
        }
      );
    }
  }
  
}