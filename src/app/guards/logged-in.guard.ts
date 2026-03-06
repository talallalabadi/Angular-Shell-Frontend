import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard  {

  constructor(private router: Router,private auth: AuthService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requestedPath = route.routeConfig?.path ?? '';

    if (!this.auth.isAuthenticated()) {
      return true;
    }

    if (requestedPath === 'register') {
      return true;
    }

    const storedMenu = (localStorage.getItem('selectedMenuCategory') || '') as MenuCategoryKey | '';
    let targetRoute = '/search';

    switch (storedMenu) {
      case 'INFORMATION':
        targetRoute = '/information';
        break;
      case 'ADMINISTRATION':
        targetRoute = '/administration';
        break;
      default:
        targetRoute = '/search';
        break;
    }

    this.router.navigate([targetRoute]);
    return false;
  }
}

type MenuCategoryKey = 'GENERAL_PUBLIC' | 'SUBSCRIBER' | 'INFORMATION' | 'ADMINISTRATION';
