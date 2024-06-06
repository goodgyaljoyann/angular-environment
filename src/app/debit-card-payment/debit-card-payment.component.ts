import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-debit-card-payment',
  templateUrl: './debit-card-payment.component.html',
  styleUrls: ['./debit-card-payment.component.css']
})
export class DebitCardPaymentComponent {
  constructor(
    public dialogRef: MatDialogRef<DebitCardPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  
  //function that checks if details were entered correctly and proceeds thereafter
  submitCreditCard(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close({ success: true, formData: form.value });
    } else {
      console.log('Form is invalid');
    }
  }
}
