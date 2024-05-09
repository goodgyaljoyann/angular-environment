import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { StatisticsService } from '../statistics/statistics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  statistics: any = {};

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics(): void {
    forkJoin({
      servicesData: this.statisticsService.getServicesStatistics(),
      appointmentsData: this.statisticsService.getAppointmentsStatistics(),
      customersData: this.statisticsService.getCustomersStatistics(),
    }).subscribe(
      ({ servicesData, appointmentsData, customersData }) => {
        this.statistics.services = servicesData;
        this.statistics.appointments = appointmentsData;
        this.statistics.products = customersData;
      },
      (error) => {
        console.error('Error fetching statistics:', error);
      }
    );
  }
}
