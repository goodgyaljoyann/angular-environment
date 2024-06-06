import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { StatisticsService } from '../statistics/statistics.service';
import Chart from 'chart.js/auto';

interface Payment {
  date: string;
  revenue: string;
}

@Component({
  selector: 'app-revenue-reports',
  templateUrl: './revenue-reports.component.html',
  styleUrls: ['./revenue-reports.component.css']
})
export class RevenueReportsComponent implements OnInit, OnDestroy, AfterViewInit {

  //Declare variables
  payments: Payment[] = []; // Initialize payments array
  isError: boolean = false; // Initialize isError to false
  pageSize: number = 3;
  totalItems: number = 8; // Total number of items
  currentPage: number = 1; // Initialize currentPage
  totalPages!: number; // Initialize totalPages with '!' to indicate it will be initialized later
  pagedPayments: Payment[] = [];



  constructor(private statisticsService: StatisticsService) {}
  
  //Initiates functions
  ngOnInit(): void {
    this.fetchPaymentsRevenue();
    this.calculateTotalPages();
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }
  
  //Function that is used to fetch revenue data
  fetchPaymentsRevenue(): void {
    this.statisticsService.getDailyRevenue().subscribe({
      next: (res) => {
        if (res['status'] == 'success') {
          this.payments = this.processData(res['data']);
          this.renderLineChart(); // Call renderLineChart here
          this.setPage(1); // Set initial page
        } else {
          this.isError = true; // Set isError to true if the response status is not 'success'
        }
      },
      error: (error) => {
        console.error('Error fetching all payments:', error);
      }
    });
  }
  
  //checks date and aggregate revenue
  processData(data: any[]): Payment[] {
    return data.map(item => {
      const date = new Date(item.date);
      const revenue = parseFloat(item.revenue);

      // Check if date is valid and revenue is a number
      if (!isNaN(date.getTime()) && !isNaN(revenue)) {
        return {
          date: date.toLocaleDateString(),
          revenue: revenue.toFixed(2)
        };
      } else {
        return {
          date: 'Invalid Date',
          revenue: 'NaN'
        };
      }
    });
  }
  
  //Initiates Revenue chart display
  ngAfterViewInit(): void {
    this.renderLineChart
  }

  //function that formats revenue chart
  private renderLineChart(): void {
    const maxPoints = 5;
    const paymentsCount = this.payments.length;
    const interval = Math.ceil(paymentsCount / maxPoints);
    const filteredPayments = [];
  
    for (let i = 0; i < paymentsCount; i += interval) {
      filteredPayments.push(this.payments[i]);
    }
  
    const chartData = {
      labels: filteredPayments.map(payment => payment.date),
      datasets: [{
        label: 'Revenue',
        data: filteredPayments.map(payment => parseFloat(payment.revenue)),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    const lineChart = new Chart(ctx, {
      type: 'line',
      data: chartData
    });
  }  
    //gets the number of pages
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }
  //Displays page numbers
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  //controls the switch between pages and displays that page
  pageChanged(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Update displayed page content or fetch data for the new page
    }
  }
  //update page numbers
  setPage(page: number): void {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.payments.length);
    this.pagedPayments = this.payments.slice(startIndex, endIndex); // Update pagedPayments instead of payments
  }
}
