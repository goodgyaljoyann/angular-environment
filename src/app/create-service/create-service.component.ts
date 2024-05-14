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

  constructor(private carServicesService: CarServicesService, private locationServicesService: LocationServicesService, public dialog: MatDialog, private router: Router,  private snackBar: MatSnackBar){}
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

  currentPage = 1;

  nextPage(): void {
    this.currentPage++;
  }

  previousPage(): void {
    this.currentPage--;
  }

  saveService(oForm: NgForm): void {
    // Merge form data into formData object
    Object.assign(this.formData, oForm.value);

    // Check if all required fields are filled
    if (this.currentPage === 2 && oForm.valid) {
      // Store form data in local storage or array
      this.storeFormData();

      // Submit the form
      this.submitForm();
    }
  }

  submitForm(): void {
    // Submit form logic here
    // You can access all form data from this.formData
    // Example: 
    this.carServicesService.createService(this.formData).subscribe({
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

  storeFormData(): void {
    // Store form data in local storage or array
    // Example using local storage:
    localStorage.setItem('formData', JSON.stringify(this.formData));
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected File:', this.selectedFile);
    // You can perform additional actions with the selected file here
  }

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
