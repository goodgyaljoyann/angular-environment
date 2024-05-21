import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AppointmentServicesService {

  private API_URL= environment.api_url+'/api/v1/appointments';
 
  constructor(private  _http:HttpClient){ }

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

  // fetches a student
  fetchAppointmentById(id:number): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  
  // creates a student
  createAppointment(data:any): Observable<any>{
    return this._http.post<any>(this.API_URL, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // updates a student
  updateAppointment(id:number, data:any): Observable<any>{
    return this._http.patch<any>(this.API_URL + `/${id}`, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // updates a student
  deleteAppointment(id:number): Observable<any>{
    return this._http.delete<any>(this.API_URL + `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

}
