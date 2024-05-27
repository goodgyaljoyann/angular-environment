import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Auth/auth.service';
import { LocationServicesService } from '../location-services/locations-services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService, private locationServicesService: LocationServicesService) {}

  locations: any[] = [];
  isError: boolean = false;

  ngOnInit(): void {
    this.populateLocations();
  }

  onSignup(form: any) {
    if (form.valid) {
      this.authService.registerUser(form.value).subscribe(
        response => {
          console.log('Signup successful', response);
        },
        error => {
          console.error('Signup failed', error);
        }
      );
    }
  }

  populateLocations() {
    const locationsSub = this.locationServicesService.fetchAllLocations().subscribe(res => {
      if (res['status'] === 'success') {
        this.locations = res['data'];
        console.log('Locations:', this.locations); // Log locations data
      } else {
        this.isError = true;
        console.log('Error fetching locations:', res['message']); // Log error message
      }
    });
  }
}