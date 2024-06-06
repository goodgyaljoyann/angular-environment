import { Component } from '@angular/core';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent {
  constructor(private authService: AuthService) {}
  
  //Function that facilitates admin registration
  onSignup(form: any) {
    if (form.valid) {
      this.authService.registerAdmin(form.value).subscribe(
        response => {
          console.log('Signup successful', response);
        },
        error => {
          console.error('Signup failed', error);
        }
      );
    }
  }
}
