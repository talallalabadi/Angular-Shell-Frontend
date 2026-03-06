import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

import {EmailAlertsService} from '../../services/email-alerts.service';
import { AuthService } from '../../services/auth.service';

/**
 * The alert object to create.
 */
export class newAlert {
  keywords_string = '';
  media = 'All';
  frequency = '';
  email = '';
}

@Component({
    selector: 'app-newAlerts',
    templateUrl: './newAlerts.component.html',
    styleUrls: ['./newAlerts.component.scss'],
    standalone: false
})

/**
 * Adds a new email alert to the database.
 */
export class NewAlertsComponent implements OnInit {
  alert: newAlert = new newAlert();

  ngOnInit(): void {}

  constructor(private emailAlertService: EmailAlertsService, private auth: AuthService) {
  	this.auth.isVerifiedToAccess();
  }

  /**
   * Sends the new email alert to the database and displays a response message.
   */
  addEmailAlert(): void {
    this.emailAlertService.createNewAlert(this.alert).subscribe(
      // res => {
      //   // Alert user of success/failure
      //   if (res.status === 200) {
      //     alert("Successful add of email alert.");
      //   } else {
      //     alert("Failure adding email alert.");
      //   }
      // }
    );
    this.alert = new newAlert();
  }

  /**
   * Validates that all input criteria has been given.
   */
  checkFilled(): boolean {
    return this.alert.keywords_string != '' && this.alert.frequency != '' && this.alert.email != '';
  }
}
