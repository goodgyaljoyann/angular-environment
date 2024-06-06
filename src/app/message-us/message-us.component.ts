import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../messages-service/message.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../Auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-message-us',
  templateUrl: './message-us.component.html',
  styleUrls: ['./message-us.component.css']
})
export class MessageUsComponent implements OnInit, OnDestroy {

  //Declare variables
  isError: boolean = false;
  messages: any[] = [];
  formData: any = {}; // Object to store form data
  private messagesSub?: Subscription; // Mark as optional

  constructor(
    private messageService: MessageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  //Initiates function
  ngOnInit(): void {
    this.populateMessage();
  }

  ngOnDestroy(): void {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
  }
  
  //Function that displays the users last message
  populateMessage(): void {
    const customer_id = this.authService.getCustomerId(); // Get customer_id
    this.messagesSub = this.messageService.fetchLastMessageByCustomerId(parseInt(customer_id, 10)).subscribe(
      res => {
        if (res.status === 'success') {
          this.messages = [res.data]; // If it's only the last message, ensure it's an array
        } else {
          this.isError = true;
        }
      },
      error => {
        this.isError = true;
        console.error('Error fetching message:', error);
      }
    );
  }
  
  //Function that stores message data
  saveMessage(newMessageForm: NgForm): void {
    const customer_id = this.authService.getCustomerId(); // Get customer_id
    const { message_content } = newMessageForm.value;

    // Add customer_id to the form data
    const formDataWithCustomerId = { ...newMessageForm.value, customer_id, message_content };

    this.messageService.createMessage(formDataWithCustomerId).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          // Show success message
          this.snackBar.open('Message sent successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          // Redirect to message-us page
          this.router.navigate(['/']);
        } else {
          this.snackBar.open('Failed to send message. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      },
      (error: any) => {
        console.error('Error creating message:', error);
        this.snackBar.open('An error occurred while creating the message. Please try again later.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
  }
}
