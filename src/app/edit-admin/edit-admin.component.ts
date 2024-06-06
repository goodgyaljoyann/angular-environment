import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin-services/admin.service';  
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.css']
})
export class EditAdminComponent implements OnInit {
  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  //Initiate function that loads admin data
  ngOnInit(): void {
    this.loadData();
  
  }
  
  // Variable Declaration
  id: number = 0; // ID for the record retrieved from the parameter
  hasData: boolean = false; // Defines whether there is data to display
  hasError: boolean = false;
  isError: boolean = false;
  formData: any = {}; // Object to store form data
  
  @ViewChild('editAdminForm') editAdminForm?: NgForm;
  
  //loads admin data into the form
  loadData() {
    this.id = this.route.snapshot.params['id'];
    this.adminService.fetchAdminById(this.id).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          const adminData = res['data']['admin'];
          console.log(adminData);
          this.hasData = true;
          // Populate formData with the values from the response
          this.formData = {
            f_name: adminData['f_name'],
            l_name: adminData['l_name'],
            email: adminData['email']
          };
        } else {
          this.hasData = false;
        }
      },
      (error) => {
        console.error('Error fetching admin data:', error);
        this.hasData = false;
      }
    );
  }
  //Function that updates admin information in the database
  updateAdmin() {
    const updateSub = this.adminService.updateAdmin(this.id, this.formData).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.hasError = false;
          // Display success notification
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigateByUrl('/dashboard');
        } else {
          this.hasError = true;
          // Display error notification
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      (error: any) => { // Specify error parameter
        console.error('Error updating profile:', error);
        // Display error notification
        this.snackBar.open('An error occurred. Please try again later.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
  }  

  
}