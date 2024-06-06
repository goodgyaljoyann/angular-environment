import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../history-services/history.service';
import { AuthService } from '../Auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DebitCardPaymentComponent } from '../debit-card-payment/debit-card-payment.component';
import { PaymentsServicesService } from '../payments-services/payments-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';
import { Observable, map } from 'rxjs';
import { CarServicesService } from '../car-services/car-services.service';

//Declare variables
interface Appointment {
  appointment_id: number;
  date: string;
  time: string;
  service_id: number;
  service_name?: string;
  appt_status: string;
  payment_status: string;
}

interface AppointmentResponse {
  status: string;
  data: Appointment[];
}

interface ServiceInfo {
  service_name: string;
}

interface ServiceResponse {
  status: string;
  data: {
    service: ServiceInfo;
  };
}


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  //Declare variables
  appointment: Appointment[] = [];
  serviceNames: { [key: number]: string } = {};
  hasData: boolean = false;

  constructor(
    private historyService: HistoryService,
    private appointmentServicesService: AppointmentServicesService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private paymentsService: PaymentsServicesService,
    private carServicesService:CarServicesService
  ) {}

  //Initiate function
  ngOnInit(): void {
    this.loadData();
  }
  
  //loads customer information by fetching id from the cookie
  loadData() {
    const customerId = this.authService.getCustomerId();
    this.historyService.fetchCustomerAppointments(parseInt(customerId)).subscribe(
      (res: AppointmentResponse) => {
        if (res.status !== 'error') {
          this.appointment = res.data;
          this.hasData = true;
          this.fetchServiceNames(); // Moved inside the if block
        } else {
          this.hasData = false;
        }
      },
      (error) => {
        console.error('Error fetching appointment history:', error);
        this.hasData = false;
      }
    );
  }
  
  //fetches service names by their id
  fetchServiceNames() {
    this.appointment.forEach((appointment: Appointment) => {
      this.fetchServiceInfo(appointment.service_id).subscribe(
        (serviceName: string) => {
          this.serviceNames[appointment.service_id] = serviceName;
        },
        (error) => {
          console.error('Error fetching service info:', error);
        }
      );
    });
  }
  
  //fetches service info by id, called in the fetchServiceNames
  fetchServiceInfo(service_id: number): Observable<string> {
    return this.carServicesService.fetchServiceById(service_id).pipe(
      map((res: ServiceResponse) => res.data.service.service_name)
    );
  }

  //Function that allows customer to pay for last appointment booked
  async payForLastAppointment(): Promise<void> {
    const customerId = this.authService.getCustomerId();//fetches customer id from cookie
    try {
      const appointmentId = await this.getLastAppointmentIdByCustomer(customerId); //calls function to get customers last appointment by their ID
  
      if (!appointmentId) {
        this.snackBar.open('No appointment found for the customer.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return;
      }
  
      const appointmentDataList = JSON.parse(localStorage.getItem('pendingAppointments') || '[]');
      const serviceIds: number[] = []; //gets pending appointment details that stored in local storage
  
      let totalAmount = 0;
      appointmentDataList.forEach((appointmentData: any) => {
        const price = parseFloat(localStorage.getItem(`service_price_${appointmentData.service_id}`) || '0');
        totalAmount += price; //gets information stored in local storage
        serviceIds.push(appointmentData.service_id);
      });
      
      //opens dialog box for customers to enter payment details
      const dialogRef = this.dialog.open(DebitCardPaymentComponent, {
        width: '500px',
        data: { totalAmount: totalAmount } // Pass totalAmount to the debit card dialog
      });
  
      dialogRef.afterClosed().subscribe(async (result: any) => {
        if (result && result.success) {
          const paymentData = {
            appointment_id: appointmentId,
            amount: totalAmount, // Use the totalAmount calculated from service prices
            creditCardInfo: result.formData // Pass the credit card form data
          };
  
          await this.updateAppointmentStatus(appointmentId, 'paid', 'scheduled', serviceIds); // No need to pass serviceIds here
  
          const res = await this.paymentsService.createPayment(paymentData).toPromise(); // processes information and save into database
          if (res.status === 'success') {
            this.snackBar.open('Payment successful and Appointment was Set', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.router.navigate(['/']);//redirects to the home page
            
          } else {
            this.snackBar.open('Failed to create payment. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      this.snackBar.open('An error occurred. Please try again later.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
  
  //Function below updates the appointment status
  async updateAppointmentStatus(appointmentId: string, paymentStatus: string, apptStatus: string, serviceIds: number[]): Promise<void> {
    try {
      const appointmentData = {
        payment_status: paymentStatus,
        appt_status: apptStatus,
        service_id: serviceIds,
      };

      const result = await this.appointmentServicesService.updateAppointment(parseInt(appointmentId, 10), appointmentData).toPromise();
      if (result.status === 'success') {
        this.snackBar.open('Appointment updated successfully', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        this.router.navigate(['/history']);
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

//Function that gets the last appointment booked by user, called in the payForLastAppointment function
async getLastAppointmentIdByCustomer(customerId: string): Promise<string | null> {
  try {
    const response = await this.appointmentServicesService.getLastAppointmentIdByCustomer(parseInt(customerId, 10)).toPromise();
    return response.appointment_id;
  } catch (error) {
    console.error('Error fetching last appointment ID:', error);
    return null;
  }
}

//updates the status of the appointment in the database
updateStatus(appointment_id: number, status: string): void {
  this.appointmentServicesService.updateAppointmentStatus(appointment_id, status).subscribe({
    next: (res) => {
      if (res['status'] === 'success') {
        this.snackBar.open('Appointment status updated successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      } else {
        console.error('Error updating appointment status:', res['message']);
        this.snackBar.open('Failed to update appointment status', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    },
    error: (error) => {
      console.error('Error updating appointment status:', error);
      this.snackBar.open('An error occurred. Please try again later.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  });
}
}
