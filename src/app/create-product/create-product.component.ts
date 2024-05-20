import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsServicesService } from '../product-services/products-services.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit, OnDestroy{

  constructor(private ProductsServicesService: ProductsServicesService, public dialog: MatDialog, private router: Router,  private snackBar: MatSnackBar){}
  isError: boolean = false;
   
   selectedFile: File | null = null;
   formData: any = {}; // Object to store form data
 
   ngOnInit(): void {
     // Initialize component logic here
     
   }
 
   ngOnDestroy(): void {
     // Clean up resources (unsubscribe from observables, etc.) here
   }

   saveService(newProductForm: NgForm): void {
    // Merge form data into formData object
    Object.assign(this.formData, newProductForm.value);
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

  submitForm(formData: FormData): void {
    // Submit form logic here
    this.ProductsServicesService.createProduct(formData).subscribe({
      next: (res) => {
        console.log('Form Data:', this.formData);
        // Log form data
        if (res['status'] === 'success') {
          // Show success message
          this.snackBar.open('Product created successfully', 'Close', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Navigate to services-controls page
          this.router.navigateByUrl('/products-controls');
        } else {
          // Handle error case
          console.error('Failed to create product:', res['message']);
          this.snackBar.open('Failed to create product. Please try again.', 'Close', {
            duration: 3000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      error: (error) => {
        console.error('Error creating product:', error);
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

}
