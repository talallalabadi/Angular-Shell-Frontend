import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs';
import { SendEmailService } from '../services/sendemail.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-contactUs',
    templateUrl: './contactUs.component.html',
    styleUrls: ['./contactUs.component.scss'],
    standalone: false
})
export class ContactUsComponent implements OnInit {

  email  = '';
  info = '';
  errorMessage = '';
  url = '';
  constructor(private http: HttpClient, private authService: AuthService,  private emailService: SendEmailService) {
  	this.authService.isVerifiedToAccess();
  }

  ngOnInit() {
  }

  submitForm() {
    if (!this.email || !this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!this.info || !this.info.trim()) {
      this.errorMessage = 'Please enter a message.';
      return;
    }

    const confirmed = window.confirm('Are you sure you want to submit?');
    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.sendForm();
  }

  sendForm(){
    this.emailService.sendForm(this.email, this.info).subscribe({
      next: () => {
        window.alert('Form sent successfully.');
        this.email = '';
        this.info = '';
      },
      error: () => {
        this.errorMessage = 'Failed to send your message. Please try again.';
      }
    });
  }


}
