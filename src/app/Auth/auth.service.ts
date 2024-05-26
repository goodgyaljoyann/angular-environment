import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:2400/api/v1/authentication'; // Your backend API URL
  private token: string | null = null;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isAdmin(): boolean {
    // Implement your logic to check if the user is an admin
    const adminId = this.getAdminId();
    return !!adminId;
  }
  

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      // Handling the successful response
      map((response: any) => {
        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
        // Returning the response if needed
        return response;
      })
    );
  }
  
  loginUser(user: any): Observable<any> {
    return this.http.post<{ token: string, customer_id: string }>(`${this.apiUrl}/login`, user)
      .pipe(
        map(response => {
          if (response && response.token && response.customer_id) {
            this.token = response.token; // Save the token
            this.saveCustomerId(response.customer_id); // Save the customer ID
            this.authStatusListener.next(true); // Update the auth status
            return response; // Return the response
          } else {
            throw new Error('Invalid response from server: token or customer_id is missing');
          }
        }),
        catchError(error => {
          throw new Error('Error occurred while logging in: ' + error.message);
        })
      );
  }
  

  saveCustomerId(customerId: string): void {
    // Save customer_id as a cookie or in local storage
    this.cookieService.set('customer_id', customerId);
    // You can also use localStorage.setItem('customer_id', customerId);
  }

  getCustomerId(): string {
    // Retrieve customer_id from cookie or local storage
    return this.cookieService.get('customer_id');
    // You can also use return localStorage.getItem('customer_id');
  }

  logout() {
    // Clear token from local storage
    localStorage.removeItem('token');

    // Clear customer ID from local storage
    localStorage.removeItem('customer_id');

    // Clear any other necessary state
    this.token = null;
    this.authStatusListener.next(false);
    
    // Redirect to the login page
    this.router.navigate(['/login']);
}

 // Admin Authentication Methods
 registerAdmin(admin: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/register-admin`, admin).pipe(
    map((response: any) => {
      this.router.navigate(['/login-admin']);
      return response;
    })
  );
}

loginAdmin(admin: any): Observable<{ token: string, admin_id: string }> {
  return this.http.post<{ token: string, admin_id: string }>(`${this.apiUrl}/login-admin`, admin)
    .pipe(
      map(response => {
        if (response && response.token && response.admin_id) {
          this.token = response.token;
          this.saveAdminId(response.admin_id);
          this.authStatusListener.next(true);
          return response;
        } else {
          throw new Error('Invalid response from server: token or admin_id is missing');
        }
      }),
      catchError(error => {
        throw new Error('Error occurred while logging in: ' + error.message);
      })
    );
}

saveAdminId(adminId: string): void {
  this.cookieService.set('admin_id', adminId);
}

getAdminId(): string {
  return this.cookieService.get('admin_id');
}

logoutAdmin() {
  localStorage.removeItem('token');
  this.cookieService.delete('admin_id');
  this.token = null;
  this.authStatusListener.next(false);
  this.router.navigate(['/login-admin']);
}

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}

