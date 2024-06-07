import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  //Declare variables
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private renderer: Renderer2) {}

  // Function that accepts login information and authenticates if user is a part of the system
  onLogin(form: any) {
    if (form.valid) {
      this.authService.loginUser(form.value).subscribe(
        response => {
          if (response && response.customer_id) {
            console.log('Login successful', response);
            const customerId = response.customer_id;
            localStorage.setItem('customer_id', customerId);//saves id to cookie
            this.router.navigate(['/']);
          } else if (response && response.error) {
            this.errorMessage = response.error;  // sends an error message
            console.error('Login failed:', response.error);
          } else {
            this.errorMessage = 'Login failed: Unknown error';
            console.error('Login failed: Response is missing customer_id or error');
          }
        },
        error => {
          this.errorMessage = 'Login failed: Invalid credentials';
          console.error('Login failed', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill out the form correctly';
    }
  }

  // Formats video, removes controls, applies loop and mute
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
