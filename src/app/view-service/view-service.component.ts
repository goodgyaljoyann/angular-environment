import { Component, OnInit } from '@angular/core';
import { CarServicesService } from '../car-services/car-services.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  constructor(
    private CarServicesService: CarServicesService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  id: number = 0; 
  service: any; 
  hasData: boolean = false; 
  recommendedServices: any[] = [];

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadData();
    });

    this.loadData();
  }

  loadData() {
    this.id = this.route.snapshot.params['id'];
    this.CarServicesService.fetchServiceById(this.id).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.service = res['data']['service'];
          this.hasData = true;
          this.loadRecommendedServices();
        } else {
          this.hasData = false;
        }
      },
      (error) => {
        console.error('Error fetching service:', error);
        this.hasData = false;
      }
    );
  }

  loadRecommendedServices() {
    this.CarServicesService.fetchAllServices().subscribe(
      (res) => {
        if (res['status'] === 'success') {
          const allServices = res['data']['services'];
          this.recommendedServices = this.getRandomServices(allServices, this.id, 3);
        }
      },
      (error) => {
        console.error('Error fetching recommended services:', error);
      }
    );
  }

  getRandomServices(services: any[], currentServiceId: number, count: number): any[] {
    const filteredServices = services.filter(service => service.id !== currentServiceId);
    const randomServices = [];
    while (randomServices.length < count && filteredServices.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredServices.length);
      randomServices.push(filteredServices.splice(randomIndex, 1)[0]);
    }
    return randomServices;
  }

  onRecommendedServiceClick(serviceId: number) {
    this.router.navigate(['/view-service', serviceId]);
  }
}
