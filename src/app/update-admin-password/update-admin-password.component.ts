import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-admin-password',
  templateUrl: './update-admin-password.component.html',
  styleUrls: ['./update-admin-password.component.css']
})
export class UpdateAdminPasswordComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateAdminPasswordComponent>,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  // Handles password update form submission
  onUpdateAdminPassword( form: NgForm): void {
    if (form.valid) {
      const adminId = this.authService.getIdOfAdmin()
      this.authService.updateAdminPassword(parseInt(adminId), form.value).subscribe(
        (res) => {
          if (res.status !== 'error') {
            this.showSnackbar('Password updated successfully', 5000);
          } else {
            this.showSnackbar('Failed to update password. Please try again.', 3000);
          }
        },
        (error) => {
          console.error('Error updating password:', error);
          this.showSnackbar('An error occurred. Please try again later.', 3000);
        }
      );
    }
  }
  
  // Closes the dialog without returning data
  onCancel(): void {
    this.dialogRef.close();
  }
  
  // Shows a snackbar with the provided message and duration
  showSnackbar(message: string, duration: number): void {
    this.snackBar.open(message, 'Close', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
