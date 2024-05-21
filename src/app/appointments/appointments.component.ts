import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationServicesService } from '../location-services/locations-services.service';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  showCart: boolean = true;
  formData: any = {}; // Object to store form data
  isError: boolean = false;
  locations: any[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private renderer: Renderer2,
    private locationServicesService: LocationServicesService,
    private appointmentServicesService: AppointmentServicesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.populateLocations();
  }

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

  get cart(): any[] {
    return this.cartService.getCart();
  }

  calculateCartTotal(): number {
    return this.cartService.calculateCartTotal();
  }

  increaseQuantity(item: any): void {
    item.quantity++;
    this.saveCartToLocalStorage();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartToLocalStorage();
    }
  }

  saveCartToLocalStorage(): void {
    this.cartService.saveCartToLocalStorage();
  }

  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.cartService.removeFromCart(itemId, itemType);
    if (this.cartService.getCart().length === 0) {
      this.showCart = false;
    }
  }

  checkout(): void {
    this.router.navigate(['/payments']);
  }

  saveService(newServiceForm: NgForm): void {
    Object.assign(this.formData, newServiceForm.value);
    const services = this.cart.filter(item => item.itemType === 'service');

    services.forEach(service => {
      const appointmentData = {
        ...this.formData,
        service_id: service.item.service_id,
        customer_id: this.getCustomerId(), // Get customer_id from cookie or session (to be implemented)
        payment_status: 'pending',
        appt_status: 'scheduled',
        mechanic_note: ''
      };

      this.submitForm(appointmentData);
    });
  }

  submitForm(formData: any): void {
    this.appointmentServicesService.createAppointment(formData).subscribe({
      next: (res) => {
        if (res['status'] === 'success') {
          this.snackBar.open('Appointment created successfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.router.navigateByUrl('/');
        } else {
          this.snackBar.open('Failed to create appointment. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        this.snackBar.open('An error occurred. Please try again later.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  getCustomerId(): string {
    // Logic to get the customer_id from browser/cookie/session (to be implemented)
    return '1';
  }

  populateLocations(): void {
    this.locationServicesService.fetchAllLocations().subscribe(res => {
      if (res['status'] === 'success') {
        this.locations = res['data'];
      } else {
        this.isError = true;
      }
    });
  }
}
