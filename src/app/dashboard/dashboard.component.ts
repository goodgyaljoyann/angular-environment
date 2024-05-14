import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StatisticsService } from '../statistics/statistics.service';
import { ViewAllAppointmentsService } from '../view-allAppointments/view-all-appointments.service';
import Chart from 'chart.js/auto';

interface Payment {
  date: string;
  revenue: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics: any = {};
  appointments: any = [];
  payments: any = [];
  isError: boolean = true;

  constructor(
    private statisticsService: StatisticsService,
    private viewAllAppointmentsService: ViewAllAppointmentsService
  ) {}
  

  ngOnInit(): void {
    this.fetchStatistics();
    this.fetchAllAppointments();
    this.fetchScheduledAppointments();
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }

  fetchStatistics(): void {
    forkJoin({
      servicesData: this.statisticsService.getServicesStatistics(),
      appointmentsData: this.statisticsService.getAppointmentsStatistics(),
      customersData: this.statisticsService.getCustomersStatistics() 
    }).subscribe(
      ({ servicesData, appointmentsData, customersData }) => {
        this.statistics.services = servicesData;
        this.statistics.appointments = appointmentsData;
        this.statistics.products = customersData;
      },
      (error) => {
        console.error('Error fetching statistics:', error);
      }
    );
  }

  //move the below code
  fetchAllAppointments(): void {
    this.viewAllAppointmentsService.getAllAppointments().subscribe({
      next: (res) => {
        console.log(res); // Log the response to see if it contains the appointments data
        if (res['status'] == 'success') {
          this.appointments = res['data'];
        } else {
          this.isError = true; // Set isError to true if the response status is not 'success'
        }
      },
      error: (error) => {
        console.error('Error fetching all appointments:', error);
      }
    });
  }  

  fetchScheduledAppointments(): void {
    this.viewAllAppointmentsService.getScheduledAppointments().subscribe({
      next: (res) => {
        console.log(res); // Log the response to see if it contains the appointments data
        if (res['status'] == 'success') {
          const formattedAppointments = this.formatAppointments(res['info']);
          // Fetch only the first three appointments
          this.appointments = formattedAppointments.slice(0, 3);
        } else {
          this.isError = true; // Set isError to true if the response status is not 'success'
        }
      },
      error: (error) => {
        console.error('Error fetching scheduled appointments:', error);
      }
    });
  }
  
  

  // Method to format appointments
  private formatAppointments(appointments: any[]): any[] {
    return appointments.map(appointment => {
      const date = new Date(appointment.date);
      return {
        ...appointment,
        formattedDate: date.toLocaleDateString() // Adjust the format as needed
         // Adjust the format as needed
      };
    });
  }
  
}
