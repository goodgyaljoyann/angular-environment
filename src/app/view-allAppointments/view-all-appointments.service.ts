import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewAllAppointmentsService {

  private API_URL = environment.api_url + '/api/v1/appointments'; // Base URL

  constructor(private _http: HttpClient) {}

  // fetches all appointments...//move this code
  getAllAppointments(): Observable<any>{
    return this._http.get<any>(this.API_URL)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // Fetch statistics for products
  getScheduledAppointments(): Observable<any> {
    const url = `${this.API_URL}/scheduled`; // Append /products route
    return this._http.get<any>(url);
  }
}
