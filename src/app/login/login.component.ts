import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  constructor(private authService: AuthService, private router:Router, private renderer: Renderer2) {}

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

  ngAfterViewInit(): void {
    const iframe = this.renderer.selectRootElement('#adVideoIframe') as HTMLIFrameElement;

    iframe.onload = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const videoElement = doc.createElement('video');
        videoElement.src = 'assets/login-bkg.mp4';
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.objectFit = 'cover';
        videoElement.controls = false;

        doc.body.appendChild(videoElement);
      }
    };

    iframe.src = 'about:blank';
  }
  
}