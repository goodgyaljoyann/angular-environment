import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StatisticsService } from '../statistics/statistics.service';
import { ViewAllAppointmentsService } from '../view-allAppointments/view-all-appointments.service';
import { AdminService } from '../admin-services/admin.service';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';


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

  //Declare variables
  statistics: any = {};
  appointments: any = [];
  payments: any = [];
  isError: boolean = true;
  admin: any;
  hasData: boolean = false;

  constructor(
    private statisticsService: StatisticsService,
    private viewAllAppointmentsService: ViewAllAppointmentsService,
    private router:Router,
    private authService:AuthService,
    private adminService:AdminService
  ) {}
  

  ngOnInit(): void {
    this.fetchStatistics();
    // this.fetchAllAppointments();
    this.fetchScheduledAppointments();
    this.loadAdminInfo();
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }

  //This code fetches statistics for admins to view on dashboard
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

  // //move the below code, not in use
  // fetchAllAppointments(): void {
  //   this.viewAllAppointmentsService.getAllAppointments().subscribe({
  //     next: (res) => {
  //       console.log(res); // Log the response to see if it contains the appointments data
  //       if (res['status'] == 'success') {
  //         this.appointments = res['data'];
  //       } else {
  //         this.isError = true; // Set isError to true if the response status is not 'success'
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching all appointments:', error);
  //     }
  //   });
  // }

  //fetches all appointments that are currently "scheduled", fetches the first 5
  fetchScheduledAppointments(): void {
    this.viewAllAppointmentsService.getScheduledAppointments().subscribe({
      next: (res) => {
        console.log(res); // Log the response to see if it contains the appointments data
        if (res['status'] == 'success') {
          const formattedAppointments = this.formatAppointments(res['info']);
          // Fetch only the first five appointments
          this.appointments = formattedAppointments.slice(0, 5);
        } else {
          this.isError = true; // Set isError to true if the response status is not 'success'
        }
      },
      error: (error) => {
        console.error('Error fetching scheduled appointments:', error);
      }
    });
  }
  
  

  // Method to format appointment date
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
  
  //code that loads admin information so that their name can be displayed
  loadAdminInfo() {
    const adminId = localStorage.getItem('admin_id');
    if (adminId !== null) {
      const adminIdNumber = parseInt(adminId, 10);
      if (!isNaN(adminIdNumber)) {
        //calls the admin service function to fetch admin ID stored in cookie
        this.adminService.fetchAdminById(adminIdNumber).subscribe(
          (res) => {
            if (res.status !== 'error') {
              this.admin = res.data.admin;
              this.hasData = true;
            } else {
              this.hasData = false;
            }
          },
          (error) => {
            console.error('Error fetching info:', error);
            this.hasData = false;
          }
        );
      } else {
        console.error('Admin ID is not a valid number');

      }
    } else {
      console.error('Admin ID not found in local storage');
      this.hasData = false;
    }
  }
  
  //allows admins to logout from the system
  logout(): void {
    this.authService.logoutAdmin();
    this.router.navigate(['/login']);
  }
}
