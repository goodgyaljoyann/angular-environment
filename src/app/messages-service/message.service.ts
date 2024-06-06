import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  //Initiates backend Api
  private API_URL= environment.api_url+'/api/v1/messages';
 
  constructor(private  _http:HttpClient){ }

  // fetches all messages
  fetchAllMessages(): Observable<any>{
    return this._http.get<any>(this.API_URL)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // fetches last message sent by customer by their Id 
  fetchLastMessageByCustomerId(customer_id:number): Observable<any>{
    return this._http.get<any>(this.API_URL+ `/last-message/${customer_id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  
  // creates a new message
  createMessage(data:any): Observable<any>{
    return this._http.post<any>(this.API_URL, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }

  // updates a message with a reply from admin
  updateMessageByReply(message_id:number, data:any): Observable<any>{
    return this._http.patch<any>(this.API_URL + `/reply/${message_id}`, data)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
  
  //delete message from database
  deleteMessage(id:number): Observable<any>{
    return this._http.delete<any>(this.API_URL + `/${id}`)
                                .pipe(
                                  map((res)=>{
                                    return res;
                                  }
                                  )
                                );
  }
}
