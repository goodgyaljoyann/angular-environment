import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationServicesService {
  //Initiates backend Api 
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

      // fetches a location by Id
  fetchLocationById(id:number): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  
}
