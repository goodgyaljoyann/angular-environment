import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin-services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit, OnDestroy {

  isError: boolean = true;
  admin: any;
  hasData: boolean = false;
  admins: any = [];

  constructor(
    private adminService: AdminService,
    private router:Router,
  ) {}

  ngOnInit(): void {
    this.displayAdmins();

  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }

    //move the below code
    displayAdmins(): void {
      this.adminService.fetchAllAdmins().subscribe({
        next: (res) => {
          console.log(res); // Log the response to see if it contains the appointments data
          if (res['status'] == 'success') {
            this.admins = res['data']['admins'];
          } else {
            this.isError = true; // Set isError to true if the response status is not 'success'
          }
        },
        error: (error) => {
          console.error('Error fetching all appointments:', error);
        }
      });
    }  
}
