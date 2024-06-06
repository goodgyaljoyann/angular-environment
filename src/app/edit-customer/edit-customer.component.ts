import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../customer-service/customer.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocationServicesService } from '../location-services/locations-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {
  constructor(
    private customerService: CustomerService,
    private locationServicesService: LocationServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  //Initiates functions
  ngOnInit(): void {
    this.loadData();
    this.populateLocations();
  }
  
  // Variable Declaration
  id: number = 0; // ID for the record retrieved from the parameter
  hasData: boolean = false; // Defines whether there is data to display
  hasError: boolean = false;
  locations: any[] = [];
  isError: boolean = false;
  formData: any = {}; // Object to store form data
  
  @ViewChild('editCustomerForm') editCustomerForm?: NgForm;
  
  //Loads customer data into form
  loadData() {
    this.id = this.route.snapshot.params['id'];
    this.customerService.fetchCustomerById(this.id).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          const customerData = res['data']['customer'];
          console.log(customerData);
          this.hasData = true;
          // Populate formData with the values from the response
          this.formData = {
            first_name: customerData['first_name'],
            last_name: customerData['last_name'],
            location_id: customerData['location_id'],
            phone: customerData['phone'],
            email: customerData['email']
          };
        } else {
          this.hasData = false;
        }
      },
      (error) => {
        console.error('Error fetching customer data:', error);
        this.hasData = false;
      }
    );
  }
  //Updates customer information in the database
  updateCustomer() {
    //calls the customer service function updateCustomer and updates with the user id and form data
    const updateSub = this.customerService.updateCustomer(this.id, this.formData).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.hasError = false;
          // Display success notification
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigateByUrl('/');
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

  //Populates locations that are in system where users can update their info
  populateLocations() {
    const locationsSub = this.locationServicesService.fetchAllLocations().subscribe(
      (res) => {
        if (res['status'] === 'success') {
          this.locations = res['data'];
          console.log('Locations:', this.locations); // Log locations data
        } else {
          this.isError = true;
          console.log('Error fetching locations:', res['message']); // Log error message
        }
      },
      (error) => {
        console.error('Error fetching locations:', error);
        this.isError = true;
      }
    );
  }
}
