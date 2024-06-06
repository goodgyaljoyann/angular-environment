import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationServicesService } from '../location-services/locations-services.service';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';
import { MatDialog } from '@angular/material/dialog';
import { DebitCardPaymentComponent } from '../debit-card-payment/debit-card-payment.component';
import { PaymentsServicesService } from '../payments-services/payments-services.service';
import { AuthService } from '../Auth/auth.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  //Declare Variables
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
    private paymentsService: PaymentsServicesService,
    private authService:AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  //Initiate function
  ngOnInit(): void {
    this.populateLocations();
    
  }
  //gets cart details
  get cart(): any[] {
    return this.cartService.getCart();
  }
  //calculate cart total
  calculateCartTotal(): number {
    return this.cartService.calculateCartTotal();
  }
  //Increases the quantity of item in cart
  increaseQuantity(item: any): void {
    item.quantity++;
    this.saveCartToLocalStorage();
  }
  
  //Decreases the quantity of item in cart
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartToLocalStorage();
    }
  }
  //Saves cart details to local storage
  saveCartToLocalStorage(): void {
    this.cartService.saveCartToLocalStorage();
  }
  
  //removes an item from cart
  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.cartService.removeFromCart(itemId, itemType);
    if (this.cartService.getCart().length === 0) {
      this.showCart = false;
    }
  }
  
  //Function that brings up dialog box
  async checkout(): Promise<void> {
    const dialogRef = this.dialog.open(DebitCardPaymentComponent, {
      width: '500px',
      data: { totalAmount: this.calculateCartTotal() }
    });
    
    //After dialog box opens it prompts users to enter payment information
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result && result.success) {
        const customerId = this.authService.getCustomerId();

        try {
          const appointmentId = await this.getLastAppointmentIdByCustomer(customerId);

          if (!appointmentId) {
            this.snackBar.open('No appointment found for the customer.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            return;
          }

          const paymentData = {
            appointment_id: appointmentId,
            amount: this.calculateCartTotal(),
            creditCardInfo: result.formData // Pass the credit card form data
          };

          const services = this.cart.filter(item => item.itemType === 'service');
          const serviceIds = services.map(service => service.item.service_id); // Extract service_ids from the cart

          await this.updateAppointmentStatus(appointmentId, 'paid', 'scheduled', serviceIds); // Pass serviceIds to updateAppointmentStatus
          const res = await this.paymentsService.createPayment(paymentData).toPromise();// updates their payment information in the database 
          if (res.status === 'success') {
            this.snackBar.open('Payment successful and Appointment was Set', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/']);
            this.cartService.clearCart();
          } else {
            this.snackBar.open('Failed to create payment. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          this.snackBar.open('An error occurred. Please try again later.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      }
    });
  }
 //Function appointment based on the last appointment created by customer
async updateAppointmentStatus(appointmentId: string, paymentStatus: string, apptStatus: string, serviceIds: string[]): Promise<void> {
    try {
      const appointmentData = {
        payment_status: paymentStatus,
        appt_status: apptStatus,
        service_id: serviceIds // Include serviceIds in appointmentData
      };

      const result = await this.appointmentServicesService.updateAppointment(parseInt(appointmentId, 10), appointmentData).toPromise();
      if (result.status === 'success') {
        this.snackBar.open('Appointment updated successfully', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/']);
      } else {
        this.snackBar.open('Failed to update appointment status', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      this.snackBar.open('An error occurred. Please try again later.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
}

//Customer can choose option to pay later, this prompts them with a dialog box
payLater(): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '250px',
    //Display a message about forfeiting products in the cart if paid later
    data: {
      message: 'Choosing to pay later forfeits the products in your cart. Do you want to continue?',
      confirmAction: 'Continue',
      cancelAction: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const services = this.cart.filter(item => item.itemType === 'service');
      const appointmentDataList: any[] = [];

      services.forEach(service => {
        const appointmentData = {
          service_id: service.item.service_id,
          payment_status: 'pending', // Define payment_status
          appt_status: 'scheduled'   // Define appt_status
        };

        appointmentDataList.push(appointmentData);

        // Store the price of the service into the local storage
        localStorage.setItem(`service_price_${service.item.service_id}`, service.item.price);
      });

      // Store the appointment data in local storage
      localStorage.setItem('pendingAppointments', JSON.stringify(appointmentDataList));

      // Get the customer ID
      const customerId = this.authService.getCustomerId();
      
      //Updates appointment Status based on last appointment by customer
      appointmentDataList.forEach(appointmentData => {
        this.getLastAppointmentIdByCustomer(customerId).then(appointmentId => {
          if (!appointmentId) {
            // Handle case when no appointment is found for the customer
            this.snackBar.open('No appointment found for the customer.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } else {
            // Parse appointmentId to number and pass both appointmentId and appointmentData to submitForm
            this.submitForm(parseInt(appointmentId), appointmentData);
          }
        });
      });      

      //Displays message to customer
      this.snackBar.open('Your appointment is scheduled. If payment is not received within 24 hours before the appointment, it will be cancelled.', 'Close', {
        duration: 20000, // 20 seconds
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      // Clear the cart
      this.cartService.clearCart();
    }
  });
}

//Updates information in the database
submitForm(appointmentId: number, formData: any): void { // Pass appointmentId and formData as arguments
  // Pass appointmentId as an argument to update the appointment
  this.appointmentServicesService.updateAppointment(appointmentId, formData).subscribe({
    next: (res) => {
      if (res.status === 'success') {
        this.snackBar.open('Your appointment is scheduled. If payment is not received within 24 hours before the appointment, it will be cancelled.', 'Close', {
          duration: 20000, // 20 seconds
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

  //Function that gets the last appointment scheduled by customer
  async getLastAppointmentIdByCustomer(customerId: string): Promise<string | null> {
    try {
      const response = await this.appointmentServicesService.getLastAppointmentIdByCustomer(parseInt(customerId, 10)).toPromise();
      return response.appointment_id;
    } catch (error) {
      console.error('Error fetching last appointment ID:', error);
      return null;
    }
  }
  
  //Populates locations so that user can view location in cart
  populateLocations(): void {
    this.locationServicesService.fetchAllLocations().subscribe(res => {
      if (res.status === 'success') {
        this.locations = res.data;
        this.createLocationMap();
      } else {
        this.isError = true;
      }
    });
  }
  
  //maps location name based on id
  createLocationMap(): void {
    this.locations.forEach(location => {
      this.locationMap[location.location_id] = location.location_name;
    });
  }
  
  //gets location name
  getLocationName(location_id: number): string {
    return this.locationMap[location_id] || 'Unknown Location';
  }
}
