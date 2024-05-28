import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(private router:Router,
    private authService:AuthService,){}
    
    searchQuery: string = '';
    
    logout(): void {
    this.authService.logoutAdmin();
    this.router.navigate(['/login-admin']);
  }

  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }
}
