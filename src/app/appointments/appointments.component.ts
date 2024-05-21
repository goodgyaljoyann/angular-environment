import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentServicesService } from '../appointment-services/appointment-services.service';
import { CartService } from '../shared/cart.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, AfterViewInit {
  
  formData: any = {}; // Object to store form data
  isError: boolean = false;
  
  constructor(
    private cartService: CartService,
    private router: Router,
    private renderer: Renderer2,
    private appointmentServicesService: AppointmentServicesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Any other initialization code
  }

  ngAfterViewInit(): void {
    // Any post view initialization code
  }

  saveAppointmentDetails(newServiceForm: NgForm): void {
    Object.assign(this.formData, newServiceForm.value);
    localStorage.setItem('appointmentDetails', JSON.stringify(this.formData));
    this.router.navigate(['/payments']);
  }

  // Other methods...
}
