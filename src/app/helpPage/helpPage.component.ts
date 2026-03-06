import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

interface FAQ {
  active: boolean; // added for toggling
  question: string;
  answer: string;
}

interface Contact {
  name: string;
  email: string;
}

@Component({
    selector: 'app-helpPage',
    templateUrl: './helpPage.component.html',
    styleUrls: ['./helpPage.component.scss'],
    standalone: false
})


export class HelpPageComponent implements OnInit {

  faqs: FAQ[] = [];
  contacts: Contact[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
 	this.authService.isVerifiedToAccess();
  }

  ngOnInit() {
    this.loadFAQs();
    this.loadContacts();
  }


  // added toggle for FAQs to take up less space and able to put more
  toggleAnswer(index: number){
    this.faqs[index].active = !this.faqs[index].active;
  }

  loadFAQs(){
    this.faqs = [
      {
        question: 'What types of media does the digiclips search engine support?',
        answer: 'Digiclips reports on various media including social media,television, radio, newspaper and magazine.',
        active: false
      },
      {
        question: 'How to set up email notificaiton?',
        answer: 'Manage your email alerts in the tab above or create a new alert when filtering in the search engine.',
        active: false
      },
      {
       question: 'Where can I find more information?',
       answer: 'Check out our official website here: ' + 'https://www.digiclipsinc.com/',
       active: false
      },
      {
        question: 'How do I work the Search feature?',
        answer: 'If you wish to make a general search, feel free to type in the search bar and press \'enter\'. For a more precise search, feel free to click on \'more options\' and enter in specifics!',
        active: false
      }
      /*
      !!add more here if you want, this is just an example
      */
    ];
  }

  loadContacts() {
    this.contacts = [
      { name: 'Bob Shapiro', email: 'rshapiro2@msn.com' },
      { name: 'Henry Bremers', email: ' hbremers@gmail.com' }

    ];
  }
}
