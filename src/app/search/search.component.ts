import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarServicesService } from '../car-services/car-services.service'; 
import { ProductsServicesService } from '../product-services/products-services.service';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';
import { Location } from '@angular/common';

//Declare variables using interfaces
interface Service {
  service_name: string;
  description: string;
  img: string;
  service_id: number;
}

interface Product {
  product_name: string;
  description: string;
  img: string;
  product_id: number;
}

interface Appointment {
  appointment_id: number;
  date: string;
  time: string;
  make: string;
  model: string;
  year: string;
  mechanic_note: string;
  payment_status: string;
  appt_status: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  //variable declaration
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private carServicesService: CarServicesService,
    private productsServicesService: ProductsServicesService,
    private appointmentServicesService: AppointmentServicesService,
    private location: Location
  ) {}
  
  //Initiates function
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['query'];
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
    });
  }

  //Function that performs search based on query information entered
  performSearch(query: string): void {
    this.searchResults = []; // Clear previous results

    // Searches all services information to see if a item matches search query
    this.carServicesService.fetchAllServices().subscribe(
      (response: any) => {
        if (response.data && Array.isArray(response.data.services)) {
          const serviceResults = response.data.services.filter((service: Service) =>
            service.service_name.toLowerCase().includes(query.toLowerCase()) ||
            service.description.toLowerCase().includes(query.toLowerCase())
          );
          this.searchResults.push(...serviceResults.map((service: Service) => ({
            type: 'service',
            id: service.service_id,
            name: service.service_name,
            img: service.img
          })));
        } else {
          console.error('Services response is not in the expected format:', response);
        }
      },
      error => {
        console.error('Error fetching services:', error);
      }
    );

    // Searches all products information to see if a item matches search query
    this.productsServicesService.fetchAllProducts().subscribe(
      (response: any) => {
        if (response.data && Array.isArray(response.data.products)) {
          const productResults = response.data.products.filter((product: Product) =>
            product.product_name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
          );
          this.searchResults.push(...productResults.map((product: Product) => ({
            type: 'product',
            id: product.product_id,
            name: product.product_name,
            img: product.img
          })));
        } else {
          console.error('Products response is not in the expected format:', response);
        }
      },
      error => {
        console.error('Error fetching products:', error);
      }
    );

    // Searches all appointments information to see if a item matches search query id.
    this.appointmentServicesService.fetchAllAppointments().subscribe(
      (response: any) => {
        console.log('Appointments response:', response); // Log the response to see its structure
        const appointments = response.data || response.data?.appointments || [];
        if (Array.isArray(appointments)) {
          const appointmentResults = appointments.filter((appointment: Appointment) =>
            appointment.appointment_id.toString().includes(query)
          );
          this.searchResults.push(...appointmentResults.map((appointment: Appointment) => ({
            type: 'appointment',
            id: appointment.appointment_id,
            date: appointment.date,
            time: appointment.time,
            make: appointment.make,
            model: appointment.model,
            year: appointment.year,
            mechanic_note: appointment.mechanic_note,
            payment_status: appointment.payment_status,
            appt_status: appointment.appt_status
          })));
        } else {
          console.error('Appointment response is not in the expected format:', response);
        }
      },
      error => {
        console.error('Error fetching appointments:', error);
      }
    );
  }
  
  //Goes to the respective view pages based on what was searched
  viewDetails(type: string, id: number): void {
    if (type === 'service') {
      // Navigate to the service view page
      window.location.href = `/view-service/${id}`;
    } else if (type === 'product') {
      // Navigate to the product view page
      window.location.href = `/view-product/${id}`;
    } else if (type === 'appointment') {
      // Navigate to the appointment view page
      window.location.href = `/view-appointment/${id}`;
    }
  }
  
  //Function that directs back to the previous page
  goBack(): void {
    this.location.back();
  }
  
}
