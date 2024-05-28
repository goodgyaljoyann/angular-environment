import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarServicesService } from '../car-services/car-services.service'; 
import { ProductsServicesService } from '../product-services/products-services.service'; 

interface Service {
  service_id: number;
  service_name: string;
  description: string;
  img:string;
  // Add other fields as needed
}

interface Product {
  product_id: number;
  product_name: string;
  description: string;
  img:string;
  // Add other fields as needed
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = []; // Modified to hold both product and service information

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carServicesService: CarServicesService,
    private productsServicesService: ProductsServicesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'];
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
    });
  }

  performSearch(query: string): void {
    this.searchResults = []; // Clear previous results

    // Fetch all services and products
    this.carServicesService.fetchAllServices().subscribe(
      (response: any) => {
        console.log('Services response:', response); // Log the response
        if (response.data && Array.isArray(response.data.services)) {
          const serviceResults = response.data.services.filter((service: Service) =>
            service.service_name.toLowerCase().includes(query.toLowerCase()) ||
            service.description.toLowerCase().includes(query.toLowerCase())
          );
          this.searchResults.push(...serviceResults.map((service: Service) => ({
            type: 'service',
            id: service.service_id,
            name: service.service_name,
            img: service.img,
          })));
        } else {
          console.error('Services response is not in the expected format:', response);
        }
      },
      error => {
        console.error('Error fetching services:', error);
      }
    );

    this.productsServicesService.fetchAllProducts().subscribe(
      (response: any) => {
        console.log('Products response:', response); // Log the response
        if (response.data && Array.isArray(response.data.products)) {
          const productResults = response.data.products.filter((product: Product) =>
            product.product_name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
          );
          this.searchResults.push(...productResults.map((product: Product) => ({
            type: 'product',
            id: product.product_id,
            name: product.product_name,
            img: product.img,
          })));
        } else {
          console.error('Products response is not in the expected format:', response);
        }
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );
  }

  viewDetails(type: string, id: number): void {
    if (type === 'service') {
      this.router.navigate(['/view-service', id]);
    } else if (type === 'product') {
      this.router.navigate(['/view-product', id]);
    }
  }
}
