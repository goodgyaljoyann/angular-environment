import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; 
import { ProductsServicesService } from '../product-services/products-services.service';
import { DeleteProductDialogComponent } from '../delete-product-dialog/delete-product-dialog.component';

@Component({
  selector: 'app-products-controls',
  templateUrl: './products-controls.component.html',
  styleUrls: ['./products-controls.component.css']
})
export class ProductsControlsComponent  implements OnInit, OnDestroy {

  constructor(private ProductServicesService: ProductsServicesService, public dialog: MatDialog, private router: Router){}

  ngOnInit(): void {
    // Initialize component logic here
    this.populateProducts();
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }
  
  //Variable Declarations
  products: any = [];
  pagedProducts: any[] = []; // Array to hold products for the current page
  pageSize: number = 3; // Number of products per page
  currentPage: number = 1; // Current page number
  isError: boolean = false;
  isPreviousDisabled: boolean = true;


  //Function in component to retrieve records through the productService
  populateProducts() {
    const productsSub = this.ProductServicesService.fetchAllProducts().subscribe(res => {
      if (res['status'] == 'success') {
        this.products = res['data']['products'];
        this.setPage(1); // Initialize the first page
      } else {
        this.isError = true;
      }
    });
  }

  //Opens dialog box that confirms whether or not user wants to remove product
  openDeleteConfirmationDialog(id: number, product_name: string, price: string): void {
    const dialogRef = this.dialog.open(DeleteProductDialogComponent, {
      width: '300px',
      data: { id, product_name, price } // Pass ID and name as data
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // Call your deleteStudent method here
        
        this.deleteProduct(id);
      }
    });
  }
  
  //Function that deletes product from system
  deleteProduct(id: number): void {
    // Call your service method to delete the student by ID
    const deleteSub = this.ProductServicesService.deleteProduct(id).subscribe(res => {
      if (res['status'] == 'success') {
        // If deletion successful, remove the student from the table
        this.products = this.products.filter((product: any) => product.id !== id);
        this.setPage(this.currentPage);
        
        // Reload the current route
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/products-controls']);
        });
      } else {
        // Handle error if deletion failed
        console.error('Failed to delete product');
      }
    });
  }
  
  //Navigation where admin can navigate through products available
  pageChanged(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.setPage(page);
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  
  
}
