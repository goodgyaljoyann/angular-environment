import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer-service/customer.service';
import { Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrls: ['./header-main.component.css']
})
export class HeaderMainComponent implements OnInit {

  constructor(private customerService: CustomerService, 
    private router:Router, private authService:AuthService) {} // Inject the customer service

  //Declare variables
  customer: any;
  hasData: boolean = false;
  customerInfo: any; // Variable to store customer information

  //Initiate function
  ngOnInit() {
    this.loadCustomerInfo(); // Load customer information when component initializes
  }

  //loads customer information to be displayed on website
  loadCustomerInfo() {
    const customerId = localStorage.getItem('customer_id');
    if (customerId !== null) {
      const customerIdNumber = parseInt(customerId, 10);
      if (!isNaN(customerIdNumber)) {
        this.customerService.fetchCustomerById(customerIdNumber).subscribe(
          (res) => {
            if (res.status !== 'error') {
              this.customer = res.data.customer;
              this.hasData = true;
            } else {
              this.hasData = false;
            }
          },
          (error) => {
            console.error('Error fetching info:', error);
            this.hasData = false;
          }
        );
      } else {
        console.error('Customer ID is not a valid number');

      }
    } else {
      console.error('Customer ID not found in local storage');
      this.hasData = false;
    }
  }
  
  //logs user out of system
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  }

