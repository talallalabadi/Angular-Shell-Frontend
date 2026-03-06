import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { GlobalVariables } from '../../common/global-variables';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit {

  errorMessage = '';

  currentPassword  = '';
  newPassword  = '';
  newPasswordCopy  = '';

  constructor(private authService: AuthService) {
 	this.authService.isVerifiedToAccess();
  }

  ngOnInit() {
  }

  submit() {
  }

  changePassword(){
    if (!this.currentPassword) {
      this.errorMessage = 'Please enter your current password.';
      return;
    }

    if (!this.newPassword || this.newPassword.length < 8) {
      this.errorMessage = 'New password must be at least 8 characters.';
      return;
    }

    if (this.newPassword !== this.newPasswordCopy) {
      this.errorMessage = 'New passwords do not match.';
      return;
    }

    this.errorMessage = '';
    const email = GlobalVariables.userEmail;
    this.authService.changepassword({password : this.currentPassword, email,
                                     newPassword : this.newPassword}).subscribe({
      next: () => {
        this.errorMessage = '';
        this.currentPassword = '';
        this.newPassword = '';
        this.newPasswordCopy = '';
      },
      error: (err) => {
        if (err.status == 500) {
          this.errorMessage = 'There was an issue processing your request. Please try again later.';
        } else if (err.status == 400) {
          this.errorMessage = typeof err.error === 'string'
            ? err.error
            : 'Incorrect current password.';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    const currentPasswordInput = document.getElementById('current-password-input') as HTMLInputElement;
    currentPasswordInput.type = currentPasswordInput.type === 'password' ? 'text' : 'password';

    const newPasswordInput = document.getElementById('new-password-input') as HTMLInputElement;
    newPasswordInput.type = newPasswordInput.type === 'password' ? 'text' : 'password';

    const confirmPasswordInput = document.getElementById('confirm-password-input') as HTMLInputElement;
    confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
  }

}
