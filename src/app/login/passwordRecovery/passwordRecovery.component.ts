import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
// import { UserService } from "../../services/user.service";
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { GlobalVariables } from "../../common/global-variables";




@Component({
    selector: 'app-login',
    templateUrl: './passwordRecovery.component.html',
    styleUrls: ['./passwordRecovery.component.scss'],
    standalone: false
})

 export class PasswordRecoveryComponent implements OnInit {
  errorMessage = '';
  successMessage = '';
  email = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /*
  * Verifies that the given email belongs to a user and if so it sends a verification link to it
  */
  SendResetLink() {
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      this.successMessage = '';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.checkEmailExists(this.email).subscribe({
      next: (response) => {
        if (response.exists) {
          this.successMessage = 'If an account exists with this email, a reset link will be sent.';
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No account found with that email address.';
          this.successMessage = '';
        }
      },
      error: () => {
        this.errorMessage = 'An error occurred. Please try again.';
        this.successMessage = '';
      }
    });
  }



}
