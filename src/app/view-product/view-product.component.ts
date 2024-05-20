import { Component, OnInit } from '@angular/core';
import { ProductsServicesService } from '../product-services/products-services.service'; 
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  constructor(
    private ProductsServicesService: ProductsServicesService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  id: number = 0;
  product: any;
  hasData: boolean = false;
  recommendedProducts: any[] = [];
  location: any;
  isError: boolean = false;

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
    this.ProductsServicesService.fetchProductById(this.id).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.product = res['data'];
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
    this.ProductsServicesService.fetchAllProducts().subscribe(
      (res) => {
        if (res['status'] === 'success') {
          const allProducts = res['data']['products'];
          this.recommendedProducts = this.getRandomProducts(allProducts, this.id, 3);
        }
      },
      (error) => {
        console.error('Error fetching recommended products:', error);
      }
    );
  }

  getRandomProducts(products: any[], currentProductId: number, count: number): any[] {
    const filteredProducts = products.filter(product => product.id !== currentProductId);
    const randomProducts = [];
    while (randomProducts.length < count && filteredProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredProducts.length);
      randomProducts.push(filteredProducts.splice(randomIndex, 1)[0]);
    }
    return randomProducts;
  }

  onRecommendedServiceClick(productId: number) {
    this.router.navigate(['/view-product', productId]);
  }
}
