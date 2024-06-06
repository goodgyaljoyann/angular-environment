import { Component, OnInit,  ChangeDetectorRef } from '@angular/core';
import { CarServicesService } from '../car-services/car-services.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LocationServicesService } from '../location-services/locations-services.service';
import { CartService } from '../shared/cart.service';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.css']
})
export class ViewServiceComponent implements OnInit {
  constructor(
    private CarServicesService: CarServicesService, 
    private LocationServicesService: LocationServicesService,
    private CartService: CartService,
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  
  //Declare variables
  id: number = 0;
  service: any;
  hasData: boolean = false;
  recommendedServices: any[] = [];
  location: any;
  isError: boolean = false;
  showCart: boolean = false; // Show/hide cart pop-up
  
  //Initialize Function
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadData();
    });

    this.loadData();
  }
  //Loads the service info based on id
  loadData() {
    this.id = this.route.snapshot.params['id'];
    this.CarServicesService.fetchServiceById(this.id).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.service = res['data']['service'];
          this.hasData = true;
          this.loadRecommendedServices();
          this.populateLocationById(this.service.location_id); // Load location based on location_id
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
  //Loads location information
  populateLocationById(locationId: number): void {
    this.LocationServicesService.fetchLocationById(locationId).subscribe(
      (res) => {
        if (res['status'] === 'success') {
          this.location = res['data'];
          console.log('Location:', this.location); // Log location data
        } else {
          this.isError = true;
          console.log('Error fetching location:', res['message']); // Log error message
        }
      },
      (error) => {
        this.isError = true;
        console.error('Error fetching location:', error);
      }
    );
  }
  //loads recommended services
  loadRecommendedServices() {
    this.CarServicesService.fetchAllServices().subscribe(
      (res) => {
        if (res['status'] === 'success') {
          const allServices = res['data']['services'];
          this.recommendedServices = this.getRandomServices(allServices, this.id, 3); //loads no > 3
        }
      },
      (error) => {
        console.error('Error fetching recommended services:', error);
      }
    );
  }
  
  //Randomizes service options
  getRandomServices(services: any[], currentServiceId: number, count: number): any[] {
    const filteredServices = services.filter(service => service.id !== currentServiceId);
    const randomServices = [];
    while (randomServices.length < count && filteredServices.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredServices.length);
      randomServices.push(filteredServices.splice(randomIndex, 1)[0]);
    }
    return randomServices;
  }
  //Directs to the respective view page of the service click on
  onRecommendedServiceClick(serviceId: number) {
    this.router.navigate(['/view-service', serviceId]);
  }
  
  //add a service to cart
  addToCart(service: any): void {
    this.CartService.addToCart(service, 'service');
    this.showCart = true;
  }
  
  //remove service from cart
  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.CartService.removeFromCart(itemId, itemType);
    if (this.CartService.getCart().length === 0) {
      this.showCart = false;
    }
    this.cdr.detectChanges();
  }
  //calculates cart total
  calculateCartTotal(): number {
    return this.CartService.calculateCartTotal();
  }
  //increases quantity of an item
  increaseQuantity(item: any): void {
    item.quantity++;
    this.saveCartToLocalStorage();
  }
  //decreases quantity of an item
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartToLocalStorage();
    }
  }
  //Saves cart to local storage
  saveCartToLocalStorage(): void {
    this.CartService.saveCartToLocalStorage();
  }
  //get cart 
  get cart(): any[] {
    return this.CartService.getCart();
  }
  //directs to payments or appointments page based on items in cart
  checkout(): void {
    const hasService = this.cart.some(item => item.itemType === 'service');
    const route = hasService ? '/appointments' : '/payments';
    this.router.navigate([route]);
  }
}
