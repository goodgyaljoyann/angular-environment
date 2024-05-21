import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationServicesService } from '../location-services/locations-services.service';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  showCart: boolean = true;
  isError: boolean = false;
  locations: any[] = [];
  locationMap: { [key: number]: string } = {}; // Map to store location_id to location_name mapping
  appointmentDetails: any;

  constructor(
    private cartService: CartService,
    private router: Router,
    private locationServicesService: LocationServicesService,
    private appointmentServicesService: AppointmentServicesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.populateLocations();
    this.loadAppointmentDetails();
  }

  loadAppointmentDetails(): void {
    const storedDetails = localStorage.getItem('appointmentDetails');
    if (storedDetails) {
      this.appointmentDetails = JSON.parse(storedDetails);
    } else {
      this.router.navigate(['/appointments']);
    }
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
    this.saveService();
  }

  saveService(): void {
    const services = this.cart.filter(item => item.itemType === 'service');
    services.forEach(service => {
      const appointmentData = {
        ...this.appointmentDetails,
        service_id: service.item.service_id,
        customer_id: this.getCustomerId(), // Get customer_id from cookie or session (to be implemented)
        payment_status: 'pending',
        appt_status: 'scheduled',
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
        this.createLocationMap();
      } else {
        this.isError = true;
      }
    });
  }

  createLocationMap(): void {
    this.locations.forEach(location => {
      this.locationMap[location.location_id] = location.location_name;
    });
  }

  getLocationName(location_id: number): string {
    return this.locationMap[location_id] || 'Unknown Location';
  }
}
