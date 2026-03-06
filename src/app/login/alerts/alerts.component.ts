import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Alert } from '../../interfaces/alert';
import { EmailAlertsService } from '../../services/email-alerts.service';
import { AuthService } from '../../services/auth.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MediaFilter } from '../../interfaces/MediaFilters';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';


@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss'],
    standalone: false
})

export class AlertsComponent implements OnInit {
  isCollapsed = true;
  countryList = [];
  marketList = [];
  newspaperList = [];
  magazineList = [];
  mediaList = [];
  socialMediaList = [];
  dropdownSettings : IDropdownSettings = {};
  newAlert: Alert = <Alert>{};
  existingAlerts: Map<string, Alert>; // alertId to alert

  // the reference to the alert currently being edited
  editableAlertId = '-';

  // stores a copy of the alert before editing so it can restore it
  // if the user decides to cancel the edit
  originalEditableAlert: Alert = null;

  isLoadingAlerts = false;

  constructor(private emailAlertService: EmailAlertsService, private authService: AuthService,  private router: Router ) {
	this.authService.isVerifiedToAccess();
  }

  ngOnInit() {
    this.countryList = [
      { item_id: 1, item_text: 'United States' },
      { item_id: 2, item_text: 'Canada' },
      { item_id: 3, item_text: 'Mexico' },
    ];

    this.marketList = [
      { item_id: 1, item_text: 'Denver' },
    ];

    this.mediaList = [
      { item_id: 1, item_text: 'Magazine' },
      { item_id: 2, item_text: 'Newspaper' },
      { item_id: 3, item_text: 'Television' },
      { item_id: 4, item_text: 'Social Media' },
      { item_id: 5, item_text: 'Radio' },
    ];

    this.socialMediaList = [
      { item_id: 1, item_text: 'Facebook' },
      { item_id: 2, item_text: 'Reddit' },
    ];

    this.newspaperList = [
      { item_id: 1, item_text: 'The New York Times' },
      { item_id: 2, item_text: 'Chicago Tribune' },
    ];

    this.magazineList = [
      { item_id: 1, item_text: 'Sports Illustrated' },
      { item_id: 2, item_text: 'National Geographic' },
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.existingAlerts = new Map<string, Alert>();
    this.getAlerts();

    this.newAlert.mediaFilters = new Map<string, MediaFilter>();
  }

  getAlerts(){
    this.isLoadingAlerts = true;
    this.emailAlertService.getAlerts().subscribe(
      res => {
        this.isLoadingAlerts = false;
        console.log(res);

        res.forEach(alertObj => {
          let alert : Alert;
          if (!this.existingAlerts.has(alertObj.alertId)) {
            alert = <Alert>{
              keywords_string: alertObj.keywords_string,
              realTimeAlerts: alertObj.realTimeAlerts,
              startDate: alertObj.startDate,
              startTime: alertObj.startTime,
              endDate: alertObj.endDate,
              endTime: alertObj.endTime,
              email: alertObj.email,
              emails: alertObj.emails,
              numOfResults: alertObj.numOfResults,
              formatEmail: alertObj.formatEmail,
              formatDoc: alertObj.formatDoc,
              formatExcel: alertObj.formatExel,
              formatPDF: alertObj.formatPDF,
              formatHTML: alertObj.formatHTML,
              digiViewType: alertObj.digiViewType,
              digiViewAndAnalysis: alertObj.digiViewAndAnalysis,
              textReport: alertObj.textReport,
              textReportAnalysis: alertObj.textReportAnalysis,
              hitReport: alertObj.hitReport,
              hitReportAndAnalysis: alertObj.hitReportAndnalysis,
              positivePhrases: alertObj.positivePhrases,
              negativePhrases: alertObj.negativePhrases,
              phrases: alertObj.phrases,
              idemailAlerts: alertObj.idemailAlerts,
              mediaFilters: new Map<string, MediaFilter>(),
              alertId: alertObj.alertId,
            };
          } else {
            alert = this.existingAlerts.get(alertObj.alertId);
          }

          let filter;
          if (alert.mediaFilters.has(alertObj.groupId)) {
            filter = alert.mediaFilters.get(alertObj.groupId);
          } else {
            filter = <MediaFilter>{
              type: alertObj.mediaType,
              countries: [],
              magazineNames: [],
              newspaperNames: [],
              markets: [],
              socialMediaNames: [],
              groupId: alertObj.groupId,
            };
          }

          if (alertObj.country) {
filter.countries.push(alertObj.country);
}

          if (alertObj.magazineName) {
filter.magazineNames.push(alertObj.magazineName);
}

          if (alertObj.newspaperName) {
filter.newspaperNames.push(alertObj.newspaperName);
}

          if (alertObj.market) {
filter.markets.push(alertObj.market);
}

          if (alertObj.socialMediaName) {
filter.socialMediaNames.push(alertObj.socialMediaName);
}


          alert.mediaFilters.set(alertObj.groupId, filter);
          console.log('Loaded email alerts:', alertObj.groupId);
          this.existingAlerts.set(alertObj.alertId, alert);

        });
        console.log('Loaded email alerts:', this.existingAlerts.size);
      },
      err => {
        console.log('Error getting email alerts:');
        console.log(err);
        this.isLoadingAlerts = false;
        // Handle 403 Forbidden response
      if (err.status === 403) {
        alert('Please subscribe to access this feature.');
        this.router.navigate(['/search']);
      } else {
        alert('Failed to load alerts. Please try again later.');
      }
      }
    );
  }

  deleteAlert(alertId: string): void {
    if (this.editableAlertId != '-' && this.editableAlertId != alertId) {
      window.alert('Can\'t delete alert while another alert is in edit mode');
      return;
    }
    this.emailAlertService.delete(alertId).subscribe(
      res => {
        window.alert('Alert deleted');
        this.existingAlerts.delete(alertId);
        // location.reload();
      },
      err => {
        window.alert('Failed deleting the alert');
      }
    );
  }

  makeAlertMutable(alertId: string): void {
    if (this.editableAlertId == '-') {
      this.editableAlertId = alertId;

      this.originalEditableAlert = {...this.existingAlerts.get(alertId)}; // make a deep copy
    } else {
      window.alert('Another alert already in edit mode');
    }
  }

  cancelAlertEdit(): void {
    this.existingAlerts.set(this.editableAlertId, this.originalEditableAlert);
    this.editableAlertId = '-';
  }

  editAlert(): void {
    console.log(this.existingAlerts.get(this.editableAlertId));
    this.emailAlertService.editAlert(this.existingAlerts.get(this.editableAlertId)).subscribe(
      res => {
        this.editableAlertId = '-';
        window.alert('Alert updated');
        // location.reload();
      },
      err => {
        window.alert('Failed updating the alert');
      }
    );
  }

  create(): void {
    console.log(this.newAlert);

    this.newAlert.email = this.authService.currentUserValue.email;
    this.newAlert.alertId = uuidv4();
    this.newAlert.mediaFilters.forEach((filter) => {
      if (filter.countries) {
        const countryList = [];
        filter.countries.forEach((country) => {
          countryList.push(country.item_text);
        });
        filter.countries = countryList;
      }

      if (filter.markets) {
        const marketList = [];
        filter.markets.forEach((market) => {
          marketList.push(market.item_text);
        });
        filter.markets = marketList;
      }

      if (filter.newspaperNames) {
        const newspaperList = [];
        filter.newspaperNames.forEach((medium) => {
          newspaperList.push(medium.item_text);
        });
        filter.newspaperNames = newspaperList;
      }

      if (filter.magazineNames) {
        const magazineList = [];
        filter.magazineNames.forEach((medium) => {
          magazineList.push(medium.item_text);
        });
        filter.magazineNames = magazineList;
      }

      if (filter.socialMediaNames && filter.socialMediaNames.length > 0) {
        console.log('Final Social Media Names being sent:', filter.socialMediaNames);
      } else {
        console.log('No social media platforms selected.');
      }
    });


    this.emailAlertService.create(this.newAlert).subscribe(
      res => {

      },
      err => {

      }
    );
    location.reload();
  }

  removeMediaFilter(alertIndex: string, filterIndex?: string): void {
    console.log(alertIndex, filterIndex);
    if (filterIndex) {
      const alert = this.existingAlerts.get(filterIndex);
      alert.mediaFilters.delete(alertIndex);
      this.existingAlerts.set(filterIndex, alert);
    } else {
      this.newAlert.mediaFilters.delete(alertIndex);
    }
  }

  addMediaFilter(event, alertId?: string): void {
    const id = uuidv4();
    const filterType = event.target.value;

    // Handle the case for Social Media
    if (filterType === 'Social Media') {
      // Create a filter object and populate socialMediaNames
      const socialMediaFilter = this.makeFilterObject(filterType, id);
      socialMediaFilter.socialMediaNames = this.socialMediaList.map(platform => platform.item_text || platform.name || null);
      console.log('Extracted Social Media Names:', socialMediaFilter.socialMediaNames);
      // Update the alert based on whether it's new or existing
      if (alertId) {
        const alert = this.existingAlerts.get(alertId);
        alert.mediaFilters.set(id, socialMediaFilter);
        this.existingAlerts.set(alertId, alert);
      } else {
        this.newAlert.mediaFilters.set(id, socialMediaFilter);
      }
    } else {
      // Handle other media types (Radio, TV, etc.)
      const otherFilter = this.makeFilterObject(filterType, id);
      if (alertId) {
        const alert = this.existingAlerts.get(alertId);
        alert.mediaFilters.set(id, otherFilter);
        this.existingAlerts.set(alertId, alert);
      } else {
        this.newAlert.mediaFilters.set(id, otherFilter);
      }
    }

    // Reset the dropdown selection
    event.target.value = event.target.default;
  }


  onChangeFilter(event, index: number): void {
    // this.newAlert.mediaFilters[index] = this.makeFilterObject(event.target.value, );
  }

  makeFilterObject(filter: string, id): MediaFilter {
    return <MediaFilter> {
      type: new String(filter),
      countries: new Array<any>(),
      markets: new Array<any>(),
      magazineNames: new Array<any>(),
      newspaperNames: new Array<any>(),
      socialMediaNames: new Array<any>(),
      groupId: id,
    };
  }
}
