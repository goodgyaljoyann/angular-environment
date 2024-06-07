import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomerService } from '../customer-service/customer.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { UpdatePasswordComponent } from '../update-password/update-password.component';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent {
  constructor(
    private CustomerService:CustomerService, 
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService:AuthService,
    private dialog:MatDialog,
    private snackBar: MatSnackBar,
  ) {}
  
  //Declare variables
  id: number = 0;
  customer: any;
  hasData: boolean = false;
  isError: boolean = false;
 
//Initiate Function
  ngOnInit(): void {
    this.loadData();
  }
  //Loads data for customer based on their Id
  loadData() {
    const customerId = this.authService.getCustomerId();
    this.CustomerService.fetchCustomerById(parseInt(customerId)).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.customer = res['data']['customer'];
          this.hasData = true;
        } else {
          this.hasData = false;
        }
      },
      (error) => {
        console.error('Error fetching customer:', error);
        this.hasData = false;
      }
    );
  }
  //Opens delete dialog box
  openDeleteConfirmationDialog(id: number, first_name: string, last_name: string): void {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '300px',
      data: { id, first_name, last_name } // Pass ID and name as data
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // Call your deleteStudent method here
        
        this.deleteCustomer(id);
      }
    });
  }
  //Deletes customer data from the database
  deleteCustomer(id: number): void {
    // Call your service method to delete the student by ID
    const deleteSub = this.CustomerService.deleteCustomerById(id).subscribe(res => {
      if (res['status'] == 'success') {
        // Reload the current route
        this.router.navigateByUrl('/view-customer', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/login']);
        });
      } else {
        // Handle error if deletion failed
        console.error('Failed to delete user');
      }
    });
  }
  
  //Opens update password dialog box
  openUpdatePasswordDialog(adminId: number): void {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      width: '300px',
      data: { id: adminId }
    });

    dialogRef.afterClosed().subscribe((result: NgForm) => {
      if (result && result.valid) {
        const formData = new FormData();
        for (const key of Object.keys(result.value)) {
          formData.append(key, result.value[key]);
        }
        //update the password of the user in database
        this.authService.updatePassword(adminId, formData).subscribe(
          (res) => {
            if (res.status !== 'error') {
              this.snackBar.open('Password updated successfully', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            } else {
              this.snackBar.open('Failed to update password. Please try again.', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top'
              });
            }
          },
          (error) => {
            console.error('Error updating password:', error);
            this.snackBar.open('An error occurred. Please try again later.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        );
      }
    });
  }
}
