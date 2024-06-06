import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CarServicesService } from '../car-services/car-services.service';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, OnDestroy {
  //Declare Variables
  selectedHeading: string = 'All'; // Default to 'All'
  services: any = [];
  isError: boolean = false;
  headings = ['All', 'Packages', 'Denting&Painting', 'Detailing', 'Repairs', 'Tires'];
  showCart: boolean = false; // Show/hide cart pop-up

  constructor(
    private CarServicesService: CarServicesService, 
    private CartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  //Initiate function
  ngOnInit(): void {
    this.populateServices();

  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }
  
  //loads all services and display on website
  populateServices() {
    this.CarServicesService.fetchAllServices().subscribe(res => {
      if (res['status'] == 'success') {
        this.services = res['data']['services'];
      } else {
        this.isError = true;
      }
    });
  }
  //Switch between active headings
  onHeadingClick(heading: string): void {
    this.selectedHeading = heading;
    this.cdr.detectChanges();
  }
  
  //Sort each service into headings/categories
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
  //Function to add service in the cart
  addToCart(service: any): void {
    this.CartService.addToCart(service, 'service');
    this.showCart = true;
  }
  //Function to remove service from cart
  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.CartService.removeFromCart(itemId, itemType);
    if (this.CartService.getCart().length === 0) {
      this.showCart = false;
    }
    this.cdr.detectChanges();
  }
  //Function to aggregate total of items in the cart
  calculateCartTotal(): number {
    return this.CartService.calculateCartTotal();
  }
  //Function to increase product quantity
  increaseQuantity(item: any): void {
    item.quantity++;
    this.saveCartToLocalStorage();
  }
  //Function to decrease product quantity
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.saveCartToLocalStorage();
    }
  }
  //Function to save cart to local storage
  saveCartToLocalStorage(): void {
    this.CartService.saveCartToLocalStorage();
  }
  
  //Function to display cart
  get cart(): any[] {
    return this.CartService.getCart();
  }
  //Function that navigates to payments or appointments based on items in cart
  checkout(): void {
    const hasService = this.cart.some(item => item.itemType === 'service');
    const route = hasService ? '/appointments' : '/payments';
    this.router.navigate([route]);
  }
}
