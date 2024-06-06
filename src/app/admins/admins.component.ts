import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../admin-services/admin.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit, OnDestroy {
  //declare variables
  isError: boolean = true;
  admin: any;
  hasData: boolean = false;
  admins: any = [];

  constructor(
    private adminService: AdminService,
    private router:Router,
    private dialog:MatDialog,
  ) {}

  ngOnInit(): void {
    this.displayAdmins();

  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }

    //displays admin details by fetching info from database
    displayAdmins(): void {
      this.adminService.fetchAllAdmins().subscribe({
        next: (res) => {
          console.log(res); // Log the response to see if it contains the appointments data
          if (res['status'] == 'success') {
            this.admins = res['data']['admins'];
          } else {
            this.isError = true; // Set isError to true if the response status is not 'success'
          }
        },
        error: (error) => {
          console.error('Error fetching all appointments:', error);
        }
      });
    }  
    //After the user initiates the "delete", it opens up dialog box
    openDeleteConfirmationDialog(id: number, f_name: string, l_name: string): void {
      const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
        width: '300px',
        data: { id, f_name, l_name } // Pass ID and name as data
      });
  
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          // Call your deleteStudent method here
          
          this.deleteAdmin(id);
        }
      });
    }
    //Function that performs the action that deletes admin information from database
    deleteAdmin(id: number): void {
      // Call your service method to delete the admin by ID
      const deleteSub = this.adminService.deleteAdminById(id).subscribe(res => {
        if (res['status'] == 'success') {
          // Reload the current route
          this.router.navigateByUrl('/view-admin', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/dashboard']);
          });
        } else {
          // Handle error if deletion failed
          console.error('Failed to delete user');
        }
      });
    }
}
