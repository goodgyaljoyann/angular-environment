import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckAvailabilityService {
  private API_URL= environment.api_url+'/api/v1/check-availability';
 
  constructor(private  _http:HttpClient){ }

  checkAvailability(date: string, time: string): Observable<any> {
    const params = new HttpParams()
      .set('date', date)
      .set('time', time);

    return this._http.get<any>(this.API_URL, { params });
  }
  
}
