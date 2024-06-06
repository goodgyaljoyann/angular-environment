import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reply-dialog',
  templateUrl: './reply-dialog.component.html',
  styleUrls: ['./reply-dialog.component.css']
})
export class ReplyDialogComponent {
  //Declare variable
  replyMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  //closes dialog box if user chooses to cancel
  onCancel(): void {
    this.dialogRef.close();
  }
}
