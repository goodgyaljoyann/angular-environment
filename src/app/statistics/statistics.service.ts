import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import map operator

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  
  private API_URL = environment.api_url + '/api/v1/statistics'; // Base URL

  constructor(private _http: HttpClient) {}

  // Fetch statistics for services
  getServicesStatistics(): Observable<any> {
    const url = `${this.API_URL}/services`; // Append /services route
    return this._http.get<any>(url);
  }

  // Fetch statistics for appointments
  getAppointmentsStatistics(): Observable<any> {
    const url = `${this.API_URL}/appointments`; // Append /appointments route
    return this._http.get<any>(url);
  }


  // Fetch statistics for products
  getCustomersStatistics(): Observable<any> {
    const url = `${this.API_URL}/customers`; // Append /products route
    return this._http.get<any>(url);
  }
}
