import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../Auth/auth.service';
import { AdminService } from '../admin-services/admin.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router:Router,
    private authService:AuthService,
    private adminService:AdminService){}
    
    //Declare variables
    searchQuery: string = '';
    hasData: boolean = false; // Defines whether there is data to display
    hasError: boolean = false;
    admin: any;
    
    //log admin out of system
    logout(): void {
    this.authService.logoutAdmin();
    this.router.navigate(['/login-admin']);
  }
  //function that facilitates search
  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }
  //Initiates function
  ngOnInit(): void {
    this.loadData()
  }

  //Function that loads admin information by fetching from cookie
  loadData() {
    this.authService.getAdminId().pipe(
      switchMap((adminId) => this.adminService.fetchAdminById(parseInt(adminId)))
    ).subscribe(
      (res) => {
        if (res['status'] !== 'error') {
          this.admin = res['data']['admin'];
          this.hasData = true;
        } else {
          this.hasData = false;
        }
      },
      (error) => {
        console.error('Error fetching admin:', error);
        this.hasData = false;
      }
    );
  }
}
