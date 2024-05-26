import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../messages-service/message.service';
import { CustomerService } from '../customer-service/customer.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../Auth/auth.service';
import { ReplyDialogComponent } from '../reply-dialog/reply-dialog.component'; // Import ReplyDialogComponent

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
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.populateMessages();
  }

  ngOnDestroy(): void {}

  messages: any = [];
  isError: boolean = false;

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
  
}
