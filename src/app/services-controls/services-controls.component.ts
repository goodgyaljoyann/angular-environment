import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { CarServicesService } from '../car-services/car-services.service';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-services-controls',
  templateUrl: './services-controls.component.html',
  styleUrls: ['./services-controls.component.css']
})
export class ServicesControlsComponent implements OnInit, OnDestroy {

  constructor(private CarServicesService: CarServicesService, public dialog: MatDialog, private router: Router){}

  ngOnInit(): void {
    // Initialize component logic here
    this.populateServices();
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }
  
  //Variable Declarations
  services: any = [];
  pagedServices: any[] = []; // Array to hold services for the current page
  pageSize: number = 3; // Number of services per page
  currentPage: number = 1; // Current page number
  isError: boolean = false;
  isPreviousDisabled: boolean = true;


  //Function in component to retrieve  all service records through the car Service
  populateServices() {
    const servicesSub = this.CarServicesService.fetchAllServices().subscribe(res => {
      if (res['status'] == 'success') {
        this.services = res['data']['services'];
        this.setPage(1); // Initialize the first page
      } else {
        this.isError = true;
      }
    });
  }
  
  //Open dialog box to delete/remove a service
  openDeleteConfirmationDialog(id: number, service_name: string, price: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: { id, service_name, price } // Pass ID and name as data
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // Call your deleteStudent method here
        
        this.deleteService(id);
      }
    });
  }
  //Function that deletes service from database
  deleteService(id: number): void {
    // Call your service method to delete the student by ID
    const deleteSub = this.CarServicesService.deleteService(id).subscribe(res => {
      if (res['status'] == 'success') {
        // If deletion successful, remove the student from the table
        this.services = this.services.filter((service: any) => service.id !== id);
        this.setPage(this.currentPage);
        
        // Reload the current route
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/services-controls']);
        });
      } else {
        // Handle error if deletion failed
        console.error('Failed to delete student');
      }
    });
  }
  
  //Detects page change
  pageChanged(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.setPage(page);
    }
  }
  //Sets and displays data for current page
  setPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedServices = this.services.slice(startIndex, endIndex);
  }
  //Calculate the total pages
  get totalPages(): number {
    return Math.ceil(this.services.length / this.pageSize);
  }
  
  //Displays number of pages
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  
  
}
