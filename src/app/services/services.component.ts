import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CarServicesService } from '../car-services/car-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy {
  selectedHeading: string = 'All'; // Default to 'All'
  services: any = [];
  isError: boolean = false;
  headings = ['All', 'Packages', 'Denting&Painting', 'Detailing', 'Repairs', 'Tires'];
  cart: any[] = []; // Cart items
  showCart: boolean = false; // Show/hide cart pop-up

  constructor(
    private CarServicesService: CarServicesService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.populateServices();
    this.loadCartFromLocalStorage();
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }

  populateServices() {
    this.CarServicesService.fetchAllServices().subscribe(res => {
      if (res['status'] == 'success') {
        this.services = res['data']['services'];
      } else {
        this.isError = true;
      }
    });
  }

  onHeadingClick(heading: string): void {
    this.selectedHeading = heading;
    this.cdr.detectChanges();
  }

  serviceMatchesHeading(service: any, heading: string): boolean {
    switch (heading) {
      case 'Packages':
        return [2, 4, 8, 9].includes(service.service_id);
      case 'Repairs':
        return [1, 6, 10, 11].includes(service.service_id);
      case 'Tires':
        return service.service_id === 5;
      case 'Detailing':
        return service.service_id === 12;
      case 'Denting&Painting':
        return service.service_id === 7;
      default:
        return true;
    }
  }

  addToCart(service: any): void {
    if (this.cart.length >= 3) {
      alert('You cannot book more than 3 services at a time.');
      return;
    }

    const existingItem = this.cart.find(item => item.service.service_id === service.service_id);
    if (!existingItem) {
      this.cart.push({ service, quantity: 1 });
      this.saveCartToLocalStorage();
    }
    this.showCart = true;
  }

  saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCartFromLocalStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      if (this.cart.length > 0) {
        this.showCart = true;
      }
    }
  }

  removeFromCart(item: any): void {
    this.cart = this.cart.filter(cartItem => cartItem !== item);
    this.saveCartToLocalStorage();
    if (this.cart.length === 0) {
      this.showCart = false;
    }
    this.cdr.detectChanges(); // Trigger change detection to update the view
  }

  calculateCartTotal(): number {
    return this.cart.reduce((total, item) => total + Number(item.service.price), 0);
  }
}
