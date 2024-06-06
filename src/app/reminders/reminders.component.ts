import { Component, OnInit } from '@angular/core';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';
import { CustomerService } from '../customer-service/customer.service';
import { CarServicesService } from '../car-services/car-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  //Declare Variables
  appointments: any[] = [];
  isError: boolean = false;
  activeAppointments: any[] = [];

  constructor(
    private appointmentServicesService: AppointmentServicesService,
    private customerService: CustomerService,
    private carServicesService: CarServicesService,
    private snackBar: MatSnackBar
  ) {}
  
  //Initiate functions
  ngOnInit(): void {
    this.fetchAppointments();
    this.fetchActiveAppointments();
  }

  //fetches appointments and joins that are active or scheduled
  fetchAppointments(): void {
    const scheduledAppointments$ = this.fetchScheduledAppointments();
    const activeAppointments$ = this.fetchActiveAppointments();

    forkJoin([scheduledAppointments$, activeAppointments$]).subscribe({
      next: ([scheduledAppointments, activeAppointments]) => {
        // Combine scheduled and active appointments
        this.appointments = [...scheduledAppointments, ...activeAppointments].slice(0, 5);
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
        this.isError = true;
      }
    });
  }
  //Fetches scheduled appointments
  fetchScheduledAppointments(): Observable<any[]> {
    return this.appointmentServicesService.getScheduledAppointments().pipe(
      switchMap((res: any) => {
        if (res['status'] === 'success') {
          const appointmentObservables: Observable<any>[] = res['info'].map((appointment: any) =>
            this.fetchAppointmentDetails(appointment)
          );
          return forkJoin(appointmentObservables);
        } else {
          throw new Error('Failed to fetch scheduled appointments');
        }
      })
    );
  }
  
  //fetches active appointments
  fetchActiveAppointments(): Observable<any[]> {
    return this.appointmentServicesService.getActiveAppointments().pipe(
      switchMap((res: any) => {
        if (res['status'] === 'success') {
          const appointmentObservables: Observable<any>[] = res['info'].map((activeAppointment: any) =>
            this.fetchAppointmentDetails(activeAppointment)
          );
          return forkJoin(appointmentObservables);
        } else {
          throw new Error('Failed to fetch active appointments');
        }
      })
    );
  }
  //Utilizes the customer id and service id to get details for customers and service
  fetchAppointmentDetails(appointment: any): Observable<any> {
    return forkJoin({
      customer: this.fetchCustomerInfo(appointment.customer_id),
      service: this.fetchServiceInfo(appointment.service_id)
    }).pipe(
      map(({ customer, service }) => ({
        ...appointment,
        customer,
        service
      }))
    );
  }

  //Function that fetches customer info
  fetchCustomerInfo(customer_id: number): Observable<any> {
    return this.customerService.fetchCustomerById(customer_id).pipe(
      map(res => res.data.customer)
    );
  }
  //Function that fetches service info
  fetchServiceInfo(service_id: number): Observable<any> {
    return this.carServicesService.fetchServiceById(service_id).pipe(
      map(res => res.data.service) // Assuming the service object has a 'name' property
    );
  }
  
  //Updates the status of appointments
  updateStatus(appointment_id: number, status: string): void {
    this.appointmentServicesService.updateAppointmentStatus(appointment_id, status).subscribe({
      next: (res) => {
        if (res['status'] === 'success') {
          this.snackBar.open('Appointment status updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.appointments = this.appointments.filter(appointment => appointment.appointment_id !== appointment_id);
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
