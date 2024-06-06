import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AppointmentServicesService {
  //Initiate Api endpoint
  private API_URL= environment.api_url+'/api/v1/appointments';
 
  constructor(private  _http:HttpClient){ }


  // fetches appointment slots, if they are availability
  getBookings(): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/bookings`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

   // fetches all Appointments
  fetchAllAppointments(): Observable<any>{
    return this._http.get<any>(this.API_URL)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // fetches an appointment by Id
  fetchAppointmentById(id:number): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  
  // creates an appointment
  createAppointment(data:any): Observable<any>{
    return this._http.post<any>(this.API_URL, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // updates an appointment by id
  updateAppointment(id:number, data:any): Observable<any>{
    return this._http.patch<any>(this.API_URL + `/${id}`, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  //Updates an appointment status
  updateAppointmentStatus(appointmentId: number, appt_status: string): Observable<any> {
    return this._http.patch<any>(`${this.API_URL}/status/${appointmentId}`, { appt_status })
      .pipe(
        map(res => res)
      );
  }

  // deletes an appointment
  deleteAppointment(id:number): Observable<any>{
    return this._http.delete<any>(this.API_URL + `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

    // Fetches scheduled appointments
    getScheduledAppointments(): Observable<any> {
      const url = `${this.API_URL}/scheduled`; // Append /products route
      return this._http.get<any>(url);
    }

    // Fetches active appointments
    getActiveAppointments(): Observable<any> {
      const url = `${this.API_URL}/active`; // Append /products route
      return this._http.get<any>(url);
    }
    //get the customers last appointment by their Id
    getLastAppointmentIdByCustomer(customerId: number): Observable<any> {
    return this._http.get<any>(`${this.API_URL}/last/${customerId}`);
    }
    //adds an additional service to an appointment slot
    addServiceToAppointment(appointmentData: any): Observable<any> {
    return this._http.post<any>(`${this.API_URL}/addService`, appointmentData);
  }
  
}
