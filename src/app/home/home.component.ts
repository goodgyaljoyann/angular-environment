import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer-service/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  customerInfo: any; // Variable to store customer information

  constructor(private customerService: CustomerService, private router:Router
  ) {} // Inject the customer service

  customer: any;
  hasData: boolean = false;
  searchQuery: string = '';

  ngOnInit() {
    this.loadCustomerInfo(); // Load customer information when component initializes
  }


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
        this.hasData = false;
      }
    } else {
      console.error('Customer ID not found in local storage');
      this.hasData = false;
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }
  
}
