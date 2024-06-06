import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';
import { CartService } from '../shared/cart.service';
import { CheckAvailabilityService } from '../Bookings/check-availability.service';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  //Declare variables
  formData: any = {}; // Object to store form data
  isError: boolean = false;
  minDate!: string;
  maxDate!: string;
  timeOptions: string[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private renderer: Renderer2,
    private appointmentServicesService: AppointmentServicesService,
    private checkAvailabilityService:CheckAvailabilityService,
    private authService:AuthService,
    private snackBar: MatSnackBar
  ) {}
  //Initiate functions
  ngOnInit(): void {
    this.setDateLimits();
    this.generateTimeOptions();
  }
  //Changes video settings to apply unique functionality such as autoplay, mute and remove controls etc.
  ngAfterViewInit(): void {
    const iframe = this.renderer.selectRootElement('#adVideoIframe') as HTMLIFrameElement;

    iframe.onload = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const videoElement = doc.createElement('video');
        videoElement.src = 'assets/Ad.mp4';
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.controls = false;

        doc.body.appendChild(videoElement);
      }
    };

    iframe.src = 'about:blank';
  }

  //Saves appointment details entered by user by getting user ID from cookie and storing info entered
  saveAppointmentDetails(newServiceForm: NgForm): void {
    const { date, time } = newServiceForm.value; // retrieved from form
    const customer_id = this.authService.getCustomerId(); // Get customer_id
  
    this.checkAvailabilityService.checkAvailability(date, time).subscribe(//check date and time to see if slot is open
      (response: { data: { isAvailable: boolean } }) => {
        const isAvailable = response.data.isAvailable;
  
        if (isAvailable) {
          // Add customer_id to the form data
          const formDataWithCustomerId = { ...newServiceForm.value, customer_id };
  
          this.appointmentServicesService.createAppointment(formDataWithCustomerId).subscribe(
            (res: any) => {
              if (res.status === 'success') {
                localStorage.setItem('appointmentDetails', JSON.stringify(res.data));
                this.router.navigate(['/payments']);
              } else {
                this.snackBar.open('Failed to create appointment. Please try again.', 'Close', {
                  duration: 3000,
                });
              }
            },
            (error: any) => {
              console.error('Error creating appointment:', error);
              this.snackBar.open('An error occurred while creating the appointment. Please try again later.', 'Close', {
                duration: 3000,
              });
            }
          );
        } else {
          this.snackBar.open('The selected time slot is fully booked. Please choose another time.', 'Close', {
            duration: 3000,
          });
        }
      },
      (error: any) => {
        console.error('Error checking availability', error);
        this.snackBar.open('There was an error checking the availability. Please try again later.', 'Close', {
          duration: 3000,
        });
      }
    );
  }  
  //changes the calendar date so that user can only book 7 days in advance
  setDateLimits(): void {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = maxDate.toISOString().split('T')[0];
  }
  //generates time slots within business hours
  generateTimeOptions(): void {
    const startTime = 9; //starts at 9 am
    const endTime = 15;  //ends at 3 pm
    const interval = 30; // 30 minutes interval
    for (let hour = startTime; hour < endTime; hour++) {
      for (let minutes = 0; minutes < 60; minutes += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        this.timeOptions.push(time);
      }
    }
  }
}
