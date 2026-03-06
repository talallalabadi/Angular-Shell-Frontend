import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.auth.currentUserValue;
    if (currentUser) {
      // Check if route is restricted by role.
      if (!this.auth.isAuthenticated() || route.data && route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){

        // Role not authorized so redirect to home page.
        this.router.navigate(['/']);
        return false;
      }

      // Authorized so return true.
      return true;
    }

    // Not logged in so redirect to login page with the return url.
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
