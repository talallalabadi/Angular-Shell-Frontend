import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchInformation } from '../interfaces/search-information';
import { environment } from '../../environments/environment';

@Injectable()
export class SendEmailService {

  // url = 'http://localhost:3000';
  url = environment.serverUrl;

  constructor(private http: HttpClient) { }

  /**
   * Sends an email to the given email address(es)
   * @param {SearchInformation} searchInformation - information to populate email
   * @returns {Observable<any>} - not sure! // TODO: figure out what this is
   */
  // sendEmail2(searchInformation: SearchInformation) {
  //   let params: URLSearchParams = new URLSearchParams();
  //   params.set('emailaddresses', searchInformation.emailAddresses);
  //   params.set('searchQuery', searchInformation.searchQuery);
  //   params.set('selectedChannel', searchInformation.selectedChannel);
  //   params.set('numOfRecords', searchInformation.numOfRecords.toString());
  //   params.set('realTimeAlerts', searchInformation.realTimeAlerts);
  //   params.set('reportFormats', searchInformation.reportFormats);
  //   return this.http.get(this.url +  "/sendEmail", {params: params}).pipe(
  //     map(response => {
  //       return response;
  //     }))
  // }
  sendEmail(searchInformation, magazineResults, newspaperResults, radioResults, socialMediaResults, tvResults) {
    console.log(searchInformation.emailAddresses);
    const params: HttpParams = new HttpParams();
    params.set('emailaddresses', searchInformation.emailAddresses);
    params.set('magResults', magazineResults);
    params.set('newspaperResults', newspaperResults);
    params.set('radioResults', radioResults);
    params.set('tvResults', tvResults);
    params.set('reportFormats', searchInformation.reportFormats);
    return this.http.get(this.url +  '/sendPage', { params }).pipe(
      map(response => response));
  }

  sendForm(email, info){
    const params: HttpParams = new HttpParams();
    params.set('email', email);
    params.set('info', info);
    // console.log("Email is : ", email);
    // console.log("Info is : " , info);
    console.log(params);
    return this.http.get(this.url + '/sendForm', {params}).pipe(
      map(response  => response)
    );
  }

}
