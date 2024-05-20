import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductsServicesService } from '../product-services/products-services.service';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  selectedHeading: string = 'All'; // Default to 'All'
  products: any = [];
  isError: boolean = false;
  headings = ['All', 'Cleaning', 'Accessories', 'Seats', 'Mats&Covers'];
  showCart: boolean = false;
  
  constructor(
    private ProductsServicesService: ProductsServicesService,
    private CartService: CartService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.populateServices();
    
  }

  ngOnDestroy(): void {
    // Clean up resources (unsubscribe from observables, etc.) here
  }

  populateServices() {
    this.ProductsServicesService.fetchAllProducts().subscribe(res => {
      if (res['status'] == 'success') {
        this.products = res['data']['products'];
      } else {
        this.isError = true;
      }
    });
  }

  onHeadingClick(heading: string): void {
    this.selectedHeading = heading;
    this.cdr.detectChanges();
  }

  productMatchesHeading(product: any, heading: string): boolean {
    switch (heading) {
      case 'Cleaning':
        return [1,3].includes(product.product_id);
      case 'Accessories':
        return product.product_id === 4;
      case 'Seats':
          return [7].includes(product.product_id);
      case 'Mats&Covers':
            return [6].includes(product.product_id);
      default:
        return true;
    }
  }

  addToCart(product: any): void {
    this.CartService.addToCart(product, 'product');
    this.showCart = true;
  }

  removeFromCart(itemId: number, itemType: 'service' | 'product'): void {
    this.CartService.removeFromCart(itemId, itemType);
    if (this.CartService.getCart().length === 0) {
      this.showCart = false;
    }
    this.cdr.detectChanges();
  }

  calculateCartTotal(): number {
    return this.CartService.calculateCartTotal();
  }

  get cart(): any[] {
    return this.CartService.getCart();
  }

}
