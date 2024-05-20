import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsServicesService } from '../product-services/products-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit{

  constructor(private ProductsServicesService: ProductsServicesService, private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadData();
    
  }
  
  // Variable Declaration
  id: number = 0; // ID for the record retrieved from the parameter
  product: any; // Variable to store a single service record
  hasData: boolean = false; // Defines whether there is data to display
  hasError: boolean = false;
  isError: boolean = false;
  selectedFile: File | null = null;
  formData: any = {}; // Object to store form data
  

  @ViewChild('editProductForm') editProductForm?: NgForm;
  
  loadData() {
    this.id = this.route.snapshot.params['id'];
    this.ProductsServicesService.fetchProductById(this.id).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          const productData = res['data']; 
          console.log(productData);
          this.hasData = true;
          if (this.editProductForm) { // Check for nullability
            this.editProductForm.setValue({
              product_name: productData['product_name'],
              description: productData['description'],
              price: productData['price'],
              
            });
          }
        } else {
          this.hasData = false;
        }
      }
    );
  }

  updateProduct(oForm: NgForm){
    const formData = new FormData();
    for (const key of Object.keys(oForm.value)) {
      formData.append(key, oForm.value[key]);
    }
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }
    console.log(formData); 
    const updateSub = this.ProductsServicesService.updateProduct(this.id, formData).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.hasError = false;
          // Display success notification
          this.snackBar.open('Service updated successfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigateByUrl('/products-controls');
        } else {
          this.hasError = true;
          // Display error notification
          this.snackBar.open('Failed to update product. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      (error: any) => { // Specify error parameter
        console.error('Error updating product:', error);
        // Display error notification
        this.snackBar.open('An error occurred. Please try again later.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
  }  
  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('Selected File:', this.selectedFile);
    // You can perform additional actions with the selected file here
  }
}

