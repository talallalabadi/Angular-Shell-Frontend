import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from '../common/global-variables';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
declare let jquery:any;
declare let $ :any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {

  password = '';
  email  = '';
  errorMessage = '';
  private readonly pendingApprovalMessage = 'Your account is pending administrator approval. You will be able to log in after it is approved.';
  onMain = false;
  url = environment.serverUrl;

  // New properties for demo request modal
  //showDemoRequestModal = false;
  //demoRequestSubmitted = false;
  rememberMe = false;
  showPassword = false;
  selectedMenu: MenuOptionKey | '' = '';

  menuOptions: { key: MenuOptionKey; label: string }[] = [
    { key: 'GENERAL_PUBLIC', label: 'General Public' },
    { key: 'SUBSCRIBER', label: 'Subscriber' },
    { key: 'INFORMATION', label: 'Information' },
    { key: 'ADMINISTRATION', label: 'Administration' },
  ];

  private readonly selectedMenuStorageKey = 'selectedMenuCategory';

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.errorMessage = '';

    // Load saved credentials if "Remember Me" was checked previously
    this.loadRememberedCredentials();

    this.httpClient.get<any>(this.url + '/getCompanyName').subscribe(
      res => {
        GlobalVariables.companyName = res;
        console.log('Company Name 1: ' + res);
      },
      err => {
        console.error('Error fetching company name:', err);
      }
    );
    console.log('Company Name 2: ' + GlobalVariables.companyName);
  }

  // Load remembered email from localStorage
  loadRememberedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberMeChecked = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMeChecked && rememberedEmail) {
      this.email = rememberedEmail;
      this.rememberMe = true;
    }
  }

  // Save or remove credentials based on Remember Me checkbox
  saveRememberedCredentials() {
    if (this.rememberMe) {
      localStorage.setItem('rememberedEmail', this.email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberMe');
    }
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }
  }
  // Main login function with validation
  loginclicked() {
    this.errorMessage = '';

    // Validate email
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    // Validate password
    if (!this.password || !this.password.trim()) {
      this.errorMessage = 'Please enter your password';
      return;
    }

    if (!this.selectedMenu) {
      this.errorMessage = 'Please select a menu before logging in';
      return;
    }

    // Save credentials if Remember Me is checked
    this.saveRememberedCredentials();

    this.storeSelectedMenuChoice();

    this.login();
  }

  login() {
    console.log('Try email: ', this.email);

    this.authService.login(this.email, this.password).subscribe(
      res => {
        window.location.reload();
      },
      err => {
        this.clearStoredMenuChoice();
        const backendMessage = this.getErrorMessage(err);
        if (err.status === 403) {
          this.errorMessage = backendMessage || this.pendingApprovalMessage;
        } else if (err.status === 500) {
          this.errorMessage = 'Sorry we are unable to log you in at this time';
        } else {
          this.errorMessage = backendMessage || 'You have entered an incorrect email or password. Please double check your credentials or register for an account.';
        }
        console.error('Login error:', err);
      }
    );
  }

  onMenuToggle(optionKey: MenuOptionKey, event: Event): void {
    const input = event.target as HTMLInputElement;
    const previousSelection = this.selectedMenu;

    if (input.checked) {
      this.selectedMenu = optionKey;
      if (previousSelection && previousSelection !== optionKey) {
        this.errorMessage = 'Only one menu may be selected at a time. Using your latest choice.';
      } else {
        this.errorMessage = '';
      }
    } else {
      if (this.selectedMenu === optionKey) {
        this.selectedMenu = '';
      }
      if (!this.selectedMenu) {
        this.errorMessage = '';
      }
    }
  }

  private storeSelectedMenuChoice(): void {
    if (this.selectedMenu) {
      localStorage.setItem(this.selectedMenuStorageKey, this.selectedMenu);
    }
  }

  private clearStoredMenuChoice(): void {
    localStorage.removeItem(this.selectedMenuStorageKey);
  }

  private getErrorMessage(err: any): string {
    if (!err) {
      return '';
    }
    if (typeof err.error === 'string') {
      return err.error;
    }
    if (err.error && typeof err.error.message === 'string') {
      return err.error.message;
    }
    if (typeof err.message === 'string') {
      return err.message;
    }
    return '';
  }

}

type MenuOptionKey = 'GENERAL_PUBLIC' | 'SUBSCRIBER' | 'INFORMATION' | 'ADMINISTRATION';
