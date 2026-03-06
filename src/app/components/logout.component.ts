import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Swap this component into app-routing.module.ts for path '/logout'
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutPageComponent {
  constructor(private router: Router, private authService: AuthService) {}

  logout() {
    // Clear localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expires_at');
    
    // Use AuthService logout if available
    if (this.authService && this.authService.logout) {
      this.authService.logout();
    }
    
    // Redirect to login after a brief delay
    setTimeout(() => {
      this.router.navigate(['']);
    }, 500);
  }
}
