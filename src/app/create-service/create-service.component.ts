import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarServicesService } from '../car-services/car-services.service';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocationServicesService } from '../location-services/locations-services.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.css']
})
export class CreateServiceComponent implements OnInit, OnDestroy {

  constructor(
    private carServicesService: CarServicesService,
    private locationServicesService: LocationServicesService, 
    public dialog: MatDialog, 
    private router: Router,  
    private snackBar: MatSnackBar){}

    //Declare variables
  isError: boolean = false;
  locations: any[] = [];
  selectedLocationId: number = 0;
  selectedFile: File | null = null;
  formData: any = {}; // Object to store form data

  ngOnInit(): void {
    // Initialize component logic here
    this.populateLocations();
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }
  
  //set current page number
  currentPage = 1;
  
  //function to move to next page
  nextPage(): void {
    this.currentPage++;
  }
  
  //function to go back to previous page
  previousPage(): void {
    this.currentPage--;
  }
  
    //Function to facilitate saving service info and transforming form data
  saveService(newServiceForm: NgForm): void {
    // Merge form data into formData object
    Object.assign(this.formData, newServiceForm.value);
  
    // Check if all required fields are filled and currentPage is 2
    if (this.currentPage === 2 && newServiceForm.valid) {
      // Store form data
      this.storeFormData();

      // Create FormData object
      const formData = new FormData();
      for (const key of Object.keys(this.formData)) {
        formData.append(key, this.formData[key]);
      }
      if (this.selectedFile) {
        formData.append('img', this.selectedFile, this.selectedFile.name);
      }

      // Submit the form
      this.submitForm(formData);
    }
  }
    //Function that saves form data in the database
  submitForm(formData: FormData): void {
    // Submit form logic here
    this.carServicesService.createService(formData).subscribe({
      next: (res) => {
        console.log('Form Data:', this.formData);
        // Log form data
        if (res['status'] === 'success') {
          // Show success message
          this.snackBar.open('Service created successfully', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Navigate to services-controls page
          this.router.navigateByUrl('/services-controls');
        } else {
          // Handle error case
          console.error('Failed to create service:', res['message']);
          this.snackBar.open('Failed to create service. Please try again.', 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (error) => {
        console.error('Error creating service:', error);
        this.snackBar.open('An error occurred. Please try again later.', 'Close', {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
  
  //stores form data into local storage
  storeFormData(): void {
    // Store form data in local storage or array
    // Example using local storage:
    localStorage.setItem('formData', JSON.stringify(this.formData));
  }
  
  //facilitates image uploads
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected File:', this.selectedFile);
    // You can perform additional actions with the selected file here
  }
  
  //populates list of locations that user can input into form
  populateLocations() {
    const locationsSub = this.locationServicesService.fetchAllLocations().subscribe(res => {
      if (res['status'] === 'success') {
        this.locations = res['data'];
      } else {
        this.isError = true;
      }
    });
  }
}
