import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { newAlert } from '../login/newAlerts/newAlerts.component';
import { Alert } from '../interfaces/alert';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { MediaFilter } from '../interfaces/MediaFilters';
import { Media } from 'docx';
@Injectable()
export class EmailAlertsService {

  // url = 'http://localhost:3000';
  url = environment.serverUrl;
  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  // getAlerts(data) {
  //   //var email = JSON.parse(localStorage.getItem('user')).email;
  //   var email = data.email;
  //   let params: HttpParams = new HttpParams();
  //   params.set('email', email);
  //   return this.httpClient.get<Array<Alert>>('emailalert/mine', {params: params})
  // }

  getAlerts(): Observable<any> {
    let userEmail;
    userEmail = this.authService.currentUserValue.email;
    let params = new HttpParams();
    params = params.append('userEmail', userEmail);

    return this.httpClient.get<any>(this.url+'/getAlerts', {params});
  }

  create(alert) {
    // data.email = JSON.parse(localStorage.getItem('user')).email;
    console.log('size:' , alert.mediaFilters.size);
    const filters = new Array<MediaFilter>();
    for (const [key, value] of alert.mediaFilters) {

      filters.push(value);
      console.log(filters);
    }

    return this.httpClient.post<any>(this.url+'/newEmailAlert', {
      email: alert.email,
      keywords_string: alert.keywords_string,
      denverTelevision: alert.denverTelevision,
      realTimeAlerts: alert.realTimeAlerts,
      country: alert.country,
      city: alert.city,
      startDate: alert.startDate,
      startTime: alert.startTime,
      endDate: alert.endDate,
      endTime: alert.endTime,
      emails: alert.email,
      numOfResults: alert.numOfResults,
      formatEmail: alert.formatEmail,
      formatDoc: alert.formatDoc,
      formatExcel: alert.formatExcel,
      formatPDF: alert.formatPDF,
      formatHTML: alert.formatHTML,
      mediaFilters: filters,
      alertId: alert.alertId,
    });
  }

  /**
   * Sends the email alert information to be added to the database.
   * @param {newAlert} alert - the alert information to send to database.
   */
  createNewAlert(alert: newAlert) {
    return this.httpClient.post(this.url+'/addEmailAlert',
      {keyword: alert.keywords_string,
        email: alert.email,
        media: alert.media,
        duration: alert.frequency
      });
  }

  delete(id) {
    const data: HttpParams = new HttpParams()
    .set('id', id);

    console.log('From email-alerts.service.ts, delete, params');
    console.log(data);
    return this.httpClient.delete(this.url+ '/emailalert', {params: data, responseType: 'text'});
  }

  editAlert(alert: Alert) {
    return this.httpClient.post(this.url+ '/emailalert/edit', alert, {responseType: 'text'});
  }

}
