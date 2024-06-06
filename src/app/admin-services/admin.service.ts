import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  //establish Api endpoint
  private API_URL= environment.api_url+'/api/v1/admins';

  constructor(private  _http:HttpClient){ }

     // fetches all Admins
     fetchAllAdmins(): Observable<any>{
      return this._http.get<any>(this.API_URL)
                                  .pipe(
                                    map((res)=>{
                                      return res;
                                    }
                                    )
                                  );
    }

  // fetches an admin by Id
  fetchAdminById(id:number): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
                              }
   // updates admin details
   updateAdmin(id:number, data:any): Observable<any>{
    return this._http.patch<any>(this.API_URL + `/${id}`, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  //delete admin information from system
  deleteAdminById(id:number): Observable<any>{
    return this._http.delete<any>(this.API_URL + `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
}
