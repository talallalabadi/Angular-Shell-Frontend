import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { newAlert } from '../login/newAlerts/newAlerts.component';
import { Alert } from '../interfaces/alert';
import { AuthService } from '../services/auth.service';
import { GlobalVariables } from '../common/global-variables';
import { environment } from '../../environments/environment';
@Injectable()
export class CustomizeLogoService {

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

  getName(): Observable<any> {
    return this.httpClient.get<any>(this.url + '/getCompanyName');
  }

  updateName(newName) {
    window.alert('Company name is updated.');
    // data.email = JSON.parse(localStorage.getItem('user')).email;
    return this.httpClient.post<any>(this.url + '/updateCompanyName', {
      companyName: newName
    });
  }
}
