import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckAvailabilityService {
  //Initiates Api endpoint
  private API_URL= environment.api_url+'/api/v1/check-availability';
 
  constructor(private  _http:HttpClient){ }
  
  //Function that checks the availability of the time slot chosen by user
  checkAvailability(date: string, time: string): Observable<any> {
    const params = new HttpParams()
      .set('date', date)
      .set('time', time);

    return this._http.get<any>(this.API_URL, { params });
  }
  
}
