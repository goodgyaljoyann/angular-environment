import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from '../admin-services/admin.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';

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
    private dialog:MatDialog
  ) {}

  id: number = 0;
  admin: any;
  hasData: boolean = false;
  isError: boolean = false;
 

  ngOnInit(): void {
    this.loadData();
  }

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
}
