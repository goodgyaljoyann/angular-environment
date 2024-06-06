import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../messages-service/message.service';
import { CustomerService } from '../customer-service/customer.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../Auth/auth.service';
import { ReplyDialogComponent } from '../reply-dialog/reply-dialog.component'; // Import ReplyDialogComponent
import { DeleteMessageDialogComponent } from '../delete-message-dialog/delete-message-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {
  constructor(
    private messageService: MessageService,
    private customerService: CustomerService,
    private dialog: MatDialog, // Inject MatDialog
    private authService: AuthService, // Inject AuthService
    private router:Router
  ) {}
  
  //Initiates function
  ngOnInit(): void {
    this.populateMessages();
  }

  ngOnDestroy(): void {}

  //Declare variables
  messages: any = [];
  isError: boolean = false;

  //Displays or populate messages in the system from users
  populateMessages() {
    const messagesSub = this.messageService.fetchAllMessages().subscribe(res => {
      if (res['status'] == 'success') {
        this.messages = res['data'];
        this.fetchCustomerDetails();
      } else {
        this.isError = true;
      }
    });
  }

  //Gets customer details and maps to each message
  fetchCustomerDetails() {
    const customerRequests = this.messages.map((message: any) => {
      return this.customerService.fetchCustomerById(message.customer_id).pipe(
        map((customerRes: any) => {
          message.customer = customerRes.data.customer;
          return message;
        })
      );
    });

    forkJoin(customerRequests).subscribe({
      next: () => {
        // Messages array is already updated, nothing else to do here
      },
      error: (err: any) => {
        console.error('Error fetching customer details:', err);
        this.isError = true;
      }
    });
  }
  
  //Function that allows admins to reply to messages
  replyToMessage(message_id: number): void {
    const dialogRef = this.dialog.open(ReplyDialogComponent, {
      width: '400px',
      data: { messageId: message_id }
    });
  
    dialogRef.afterClosed().subscribe((replyMessage: string) => {
      if (replyMessage) {
        this.authService.getAdminId().subscribe((adminId: string) => {
          const data = { admin_id: adminId, reply: replyMessage };
          this.messageService.updateMessageByReply(message_id, data).subscribe(response => {
            // Handle response if needed
          });
        });
      }
    });
  }
  //Opens delete dialog box that allows admins to delete messages
  openDeleteConfirmationDialog(id: number, first_name: string, last_name: string): void {
    const dialogRef = this.dialog.open(DeleteMessageDialogComponent, {
      width: '300px',
      data: { id, first_name, last_name } // Pass ID and name as data
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // Call your deleteStudent method here
        
        this.deleteMessage(id);
      }
    });
  }
  //Function that deletes message
  deleteMessage(id: number): void {
    // Call your service method to delete the message by ID
    const deleteSub = this.messageService.deleteMessage(id).subscribe(res => {
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
