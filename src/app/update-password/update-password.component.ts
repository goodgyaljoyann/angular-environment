import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { AuthService } from '../Auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  onUpdatePassword(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('oldPassword', form.value.oldPassword);
      formData.append('newPassword', form.value.newPassword);
  
      this.authService.updatePassword(this.data.id, formData).subscribe(
        (res) => {
          if (res.status !== 'error') {
            this.snackBar.open('Password updated successfully', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.closeModal();
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
  }
  
  
}
