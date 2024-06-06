import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarServicesService {
  //Initiates Api endpoint
  private API_URL= environment.api_url+'/api/v1/services';
 
  constructor(private  _http:HttpClient){ }

   // fetches all services
  fetchAllServices(): Observable<any>{
    return this._http.get<any>(this.API_URL)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // fetches service by Id
  fetchServiceById(id:number): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  
  // creates a new service in the database
  createService(data:any): Observable<any>{
    return this._http.post<any>(this.API_URL, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // updates service information
  updateService(id:number, data:any): Observable<any>{
    return this._http.patch<any>(this.API_URL + `/${id}`, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // deletes service information from database
  deleteService(id:number): Observable<any>{
    return this._http.delete<any>(this.API_URL + `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

}
