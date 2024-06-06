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
  
  //Declare variables
  locations: any[] = [];
  isError: boolean = false;
  
  //Initiate function
  ngOnInit(): void {
    this.populateLocations();
  }
  
  //function that registers user on the system
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
  
  //populates locations that users can choose from when registering
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