import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GlobalVariables } from '../../common/global-variables';

interface MenuEntry {
  label: string;
  route?: string;
  action?: () => void;
  placeholder?: boolean;
  reloadOnSameRoute?: boolean;
}

type MenuCategoryKey = 'GENERAL_PUBLIC' | 'SUBSCRIBER' | 'INFORMATION' | 'ADMINISTRATION';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  isUserMenuOpen = false;
  selectedCategory: MenuCategoryKey | null = null;

  private readonly selectedMenuStorageKey = 'selectedMenuCategory';

  constructor(private router: Router, public auth: AuthService) {}

  ngOnInit(): void {
    this.selectedCategory = this.getStoredMenuCategory();
  }

  get companyName(): string {
    return GlobalVariables.companyName;
  }

  get logoPath(): string {
    return '/assets/images/logo.svg';
  }

  get isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  get userInitials(): string {
    const email = this.auth.currentUserValue?.email;
    if (!email) {
      return '?';
    }
    const [localPart] = email.split('@');
    if (!localPart) {
      return email.charAt(0).toUpperCase();
    }
    const letters = localPart.replace(/[^a-zA-Z]/g, '');
    if (!letters) {
      return localPart.charAt(0).toUpperCase();
    }
    return letters.substring(0, 2).toUpperCase();
  }

  get userEmail(): string | undefined {
    return this.auth.currentUserValue?.email;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event?: Event): void {
    const target = event?.target as HTMLElement | undefined;
    const insideNav = target ? target.closest('.navbar') : false;
    const insideUserMenu = target ? target.closest('.user-menu') : false;

    if (!insideUserMenu) {
      this.isUserMenuOpen = false;
    }

    if (!insideNav) {
      this.isMenuOpen = false;
    }
  }

  logout(): void {
    this.auth.logout();
    localStorage.removeItem(this.selectedMenuStorageKey);
    this.selectedCategory = null;
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
    this.router.navigate(['']);
  }

  // -------------------- Post-login hardcoded categories & submenus --------------------
  private readonly submenuMap: Record<MenuCategoryKey, MenuEntry[]> = {
    GENERAL_PUBLIC: [
      { label: 'Search', route: '/search' },
      { label: 'Option', route: '/option', placeholder: true },
      { label: 'Chat', route: '/digichat' },
     // { label: 'Language Translation', route: '/languageTranslation' },
      { label: 'Subscriber', route: '/newAlerts' },
      { label: 'User Profile', route: '/profile' },
      { label: 'Contact Us', route: '/contactUs' },
      { label: 'Survey', route: '/survey', placeholder: true },
      // DISABLED: Sign out commented out - removed from navigation
      // { label: 'Sign out', action: () => this.logout() },
      { label: 'Help', route: '/helpPage' },
      { label: 'Advanced Search', action: () => this.toggleAdvancedSearch(), placeholder: true },
    ],
    SUBSCRIBER: [
      { label: 'Search', route: '/search' },
      { label: 'Option', route: '/option', placeholder: true },
      { label: 'Email Alerts', route: '/alerts' },
      { label: 'Archive Media', route: '/archiveMedia', placeholder: true },
      { label: 'Media Contacts', route: '/mediaContacts', placeholder: true },
      { label: 'Media Transfer', route: '/mediaTransfer' },
      { label: 'Media Analytics', route: '/mediaAnalytics' },
      { label: 'Language Translation', route: '/languageTranslation' },
      { label: 'User Profile', route: '/profile' },
      { label: 'Contact Us', route: '/contactUs' },
      { label: 'Opinion', route: '/opinion', placeholder: true },
      // DISABLED: Sign out commented out - removed from navigation
      // { label: 'Sign out', action: () => this.logout() },
      { label: 'Help', route: '/helpPage' },
      { label: 'Advanced Search', action: () => this.toggleAdvancedSearch(), placeholder: true },
      { label: 'Chat', route: '/digichat' },
    ],
    INFORMATION: [
      { label: 'Information', route: '/information', placeholder: true },
      // DISABLED: Sign out commented out - removed from navigation
      // { label: 'Sign out', action: () => this.logout() },
      { label: 'Help', route: '/helpPage' },
      { label: 'Advanced Search', action: () => this.toggleAdvancedSearch(), placeholder: true },
    ],
    ADMINISTRATION: [
      { label: 'Administration', route: '/administration', placeholder: true },
      { label: 'Approvals', route: '/admin/approvals' },
      { label: 'Chat', route: '/digichat' },
      { label: 'Media Transfer', route: '/mediaTransfer' },
      // DISABLED: Sign out commented out - removed from navigation
      // { label: 'Sign out', action: () => this.logout() },
      { label: 'Help', route: '/helpPage' },
      { label: 'Advanced Search', action: () => this.toggleAdvancedSearch(), placeholder: true },
    ],
  };

  get menuItems(): MenuEntry[] {
    if (!this.isAuthenticated) {
      return [];
    }

    if (this.selectedCategory && this.submenuMap[this.selectedCategory]) {
      return this.submenuMap[this.selectedCategory];
    }

    return this.submenuMap.GENERAL_PUBLIC;
  }

  onMenuItemClick(item: MenuEntry, event: Event): void {
    event.preventDefault();

    if (item.action) {
      item.action();
      return;
    }

    if (item.route) {
      if (item.reloadOnSameRoute && this.router.url === item.route) {
        location.reload();
      } else {
        this.router.navigate([item.route]);
      }
    }

    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  onLogoutClick(event: Event): void {
    event.preventDefault();
    this.logout();
  }

  toggleAdvancedSearch(): void {
    // If not on search page, navigate to it first
    if (this.router.url !== '/search') {
      this.router.navigate(['/search']).then(() => {
        // After navigation completes, dispatch the toggle event
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('toggleAdvancedSearch'));
        }, 100);
      });
    } else {
      // Already on search page, dispatch toggle event immediately
      window.dispatchEvent(new CustomEvent('toggleAdvancedSearch'));
    }
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  private getStoredMenuCategory(): MenuCategoryKey | null {
    const stored = localStorage.getItem(this.selectedMenuStorageKey);
    if (!stored) {
      return null;
    }

    if (stored in this.submenuMap) {
      return stored as MenuCategoryKey;
    }

    return null;
  }

}


