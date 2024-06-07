import { Component, OnInit, ViewChild , AfterViewInit } from '@angular/core';
import { CarServicesService } from '../car-services/car-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocationServicesService } from '../location-services/locations-services.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css']
})
export class EditServiceComponent implements OnInit, AfterViewInit{

  constructor(private CarServicesService: CarServicesService,
      private locationServicesService: LocationServicesService, 
      private route: ActivatedRoute, 
      private router: Router, 
      private snackBar: MatSnackBar) {}
  
      //Initiate load of service data
  ngAfterViewInit(): void {
        this.loadData();
  }
      //Initiates function
  ngOnInit(): void {
    this.populateLocations();
  }
  
  // Variable Declaration
  id: number = 0; // ID for the record retrieved from the parameter
  service: any; // Variable to store a single service record
  hasData: boolean = false; // Defines whether there is data to display
  hasError: boolean = false;
  locations: any[] = [];
  isError: boolean = false;
  selectedFile: File | null = null;
  formData: any = {}; // Object to store form data
  

  @ViewChild('editServiceForm') editServiceForm?: NgForm;
  
  //loads service data into form
  loadData() {
    this.id = this.route.snapshot.params['id'];
    this.CarServicesService.fetchServiceById(this.id).subscribe(
      (res) => {
        if (res && res['status'] !== 'error' && res['data'] && res['data']['service']) {
          const serviceData = res['data']['service'];
          console.log(serviceData);
          this.hasData = true;
          // Check if form is initialized
          if (this.editServiceForm) {
            // Fill the form with the values from the response
            this.editServiceForm.setValue({
              service_name: serviceData['service_name'] || '',
              description: serviceData['description'] || '',
              location_id: serviceData['location_id'] || '',
              price: serviceData['price'] || '',
              img: serviceData['img'] || ''
            });
          } else {
            console.error('Edit service form is not initialized');
          }
        } else {
          this.hasData = false;
          console.error('Error fetching service data:', res);
        }
      },
      (error) => {
        console.error('Error fetching service:', error);
        this.hasData = false;
      }
    );
  }
  
  
  //function that updates service information in the database
  updateService(oForm: NgForm){
    const formData = new FormData();
    for (const key of Object.keys(oForm.value)) {
      formData.append(key, oForm.value[key]);
    }
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }
    console.log(formData); 
    const updateSub = this.CarServicesService.updateService(this.id, formData).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.hasError = false;
          // Display success notification
          this.snackBar.open('Service updated successfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigateByUrl('/services-controls');
        } else {
          this.hasError = true;
          // Display error notification
          this.snackBar.open('Failed to update service. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      (error: any) => { // Specify error parameter
        console.error('Error updating service:', error);
        // Display error notification
        this.snackBar.open('An error occurred. Please try again later.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
  }  
  
  //populates locations for admin to select from to update service information
  populateLocations() {
    const locationsSub = this.locationServicesService.fetchAllLocations().subscribe(res => {
      if (res['status'] === 'success') {
        this.locations = res['data'];
        console.log('Locations:', this.locations); // Log locations data
      } else {
        this.isError = true;
        console.log('Error fetching locations:', res['message']); // Log error message
      }
    });
  }
  
  //facilitates image uploads
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected File:', this.selectedFile);
    // You can perform additional actions with the selected file here
  }
}
