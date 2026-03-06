import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import { SignUpForm} from '../../services/auth.service';
import { environment } from '../../../environments/environment';
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent implements OnInit {

  newUser: SignUpForm = new SignUpForm();
  passwordCheck = '';
  errorMessage = '';
  successMessage = '';
  private readonly approvalPendingMessage = 'Your registration was successful. Your account is pending administrator approval. You will be notified once access is granted.';
  constructor(private authService: AuthService, private router: Router) { }
  termsAndServicesLocation = environment.serverUrl + '/' +  environment.termsOfUseDocumentName;
  ngOnInit() {
  }

  // Register a new user
  register(): void {
    //check that terms are accepted
    const termsCheckbox = document.getElementById('AcceptTermCheck') as HTMLInputElement;
    if (!termsCheckbox || !termsCheckbox.checked) {
      this.successMessage = '';
      this.errorMessage = 'You must accept the Terms of Service to register.';
      return;
    }

    //check for empty inputs
    if (!this.newUser.password || !this.newUser.fname || !this.newUser.lname || !this.newUser.email){
  	    //Set messages to display empty input error
        this.successMessage = '';
	      this.errorMessage = 'Error: Expected non-empty input';
	    return;
    }

    //check password match and length
    if (this.passwordCheck == this.newUser.password && this.newUser.password.length >= 8) {
      //call auth service to register the new user
      this.authService.register(this.newUser).subscribe(
	      () => {
          // set fixed success messaging so users know approval is pending
	        this.successMessage = this.approvalPendingMessage;
          this.errorMessage = '';
          //this.router.navigate(['/']);  Dont immediately navigate to login page so users can see the message...
        },
	      error => {
	        //set messages to display either a specific error from auth services or a general error.
	        if (error.status == 500) {
            this.successMessage = '';
            this.errorMessage = 'There was an issue processing your request. Please try again later.';
	        } else {
	  	      this.successMessage = '';
	  	      this.errorMessage = typeof error.error === 'string'
	  	        ? error.error
	  	        : 'An error occurred. Please try again.';
	        }
        }
      );
    } else {
      //set messages to display the corresponding password error
    	this.successMessage = '';
 	    if (this.newUser.password.length < 8) {
		    this.errorMessage = 'Password must be at least 8 characters.';
	    } else {
		    this.errorMessage = 'Passwords do not match';
	    }
    }
  }

  
  togglePasswordVisibility(): void {
    const passwordInput = document.getElementById('password-input') as HTMLInputElement;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';

    const confirmPasswordInput = document.getElementById('confirm-password-input') as HTMLInputElement;
    confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
  }

  getTermsAndServicesLocation() {
    return this.termsAndServicesLocation;
  }

}
