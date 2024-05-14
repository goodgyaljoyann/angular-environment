import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationServicesService {
  private API_URL= environment.api_url+'/api/v1/locations';
 
  constructor(private  _http:HttpClient){ }


     // fetches all locations
     fetchAllLocations(): Observable<any>{
      return this._http.get<any>(this.API_URL)
                                  .pipe(
                                    map((res)=>{
                                      return res;
                                    }
                                    )
                                  );
    }
}
