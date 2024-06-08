import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../admin-services/admin.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAdminPasswordComponent } from '../update-admin-password/update-admin-password.component'; 
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-admin',
  templateUrl: './view-admin.component.html',
  styleUrls: ['./view-admin.component.css']
})
export class ViewAdminComponent {
  constructor(
    private adminService:AdminService, 
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService:AuthService,
    private snackBar: MatSnackBar,
    private dialog:MatDialog
  ) {}
  
  //Declare variables
  id: number = 0;
  admin: any;
  hasData: boolean = false;
  isError: boolean = false;
 
  //Initiate function
  ngOnInit(): void {
    this.loadData();
  }
  
  //Loads admin data based on Id
  loadData() {
    this.id = this.route.snapshot.params['id'];
    this.adminService.fetchAdminById(this.id).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.admin = res['data']['admin'];
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
  //If admin chooses to delete account, this opens the dialog box
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
  //Function to remove admin details from database
  deleteAdmin(id: number): void {
    // Call your service method to delete the student by ID
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
  //Open the update password dialog box
openUpdatePasswordDialog(adminId: number): void {
  const dialogRef = this.dialog.open(UpdateAdminPasswordComponent, {
    width: '300px',
    data: { id: adminId }
  });

}

    
}
