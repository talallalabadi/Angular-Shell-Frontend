import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import moment from 'moment';
import { exit } from 'process';
// import { UserCollection } from  "../interfaces/userAccount"
// import { UserService } from "user.service";
import { CustomHttpParamEncoder } from '../common/CustomHttpParamEncoder';
import { IsVerified } from '../interfaces/isVerified';
import { catchError, timeout } from 'rxjs/operators';
import { of } from 'rxjs';


export class SignUpForm{
  fname = '';
  lname = '';
  email = '';
  password = '';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private readonly GUEST_SEARCH_LIMIT = 5;
  private guestSearchesLeft = 5;  // Initialize to max

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // url = 'http://localhost:3000';
  url = environment.serverUrl;

  public isGuestUser(): boolean {
    return this.currentUserValue?.email === 'guest@digimedia.com';
  }

  public getGuestSearchesLeft(): number {
    return this.guestSearchesLeft;
  }

  public updateGuestSearchesLeft(searchesLeft: number) {
    this.guestSearchesLeft = searchesLeft;
  }

  // Request a demo with ads
  requestDemo(email: string): Observable<any> {
    return this.http.post<any>(`${this.url}/requestDemo`, { email });
  }

  // Check if user has an approved demo
  checkDemoStatus(): Observable<any> {
    return this.http.get<any>(`${this.url}/checkDemoStatus`);
  }

  // Modified setGuestUser to check demo status first
  setGuestUser(): Observable<any> {
    const guestUser: User = {
      email: 'guest@digimedia.com',
      firstName: 'Guest',
      lastName: 'User',
      role: 'Public',
      companyName: ''
    };

    return this.http.post<any>(`${this.url}/registerGuest`, { email: guestUser.email })
      .pipe(
        map(response => {
          if (!response.token) {
            throw new Error('No token received from server');
          }

          // Initialize guest searches to maximum initially
          this.guestSearchesLeft = this.GUEST_SEARCH_LIMIT;

          // Create a response object that matches the login response format
          const loginResponse = {
            email: guestUser.email,
            firstName: guestUser.firstName,
            lastName: guestUser.lastName,
            role: guestUser.role,
            token: response.token,
            expiresIn: response.expiresIn
          };

          this.setLocalStorage(loginResponse);

          // After setting up the guest user, fetch the actual search count from the server
          // This ensures we get the correct count if the user has already performed searches today
          this.fetchGuestSearchCount().subscribe();

          return guestUser;
        })
      );
  }

  // Fetch the current guest search count from the server
  fetchGuestSearchCount(): Observable<any> {
    return this.http.get<any>(`${this.url}/guestSearchCount`).pipe(
      map((response: any) => {
        if (response.searchesLeft !== undefined) {
          this.guestSearchesLeft = response.searchesLeft;
        }
        return response;
      }),
      catchError(error => {
        console.error('Error fetching guest search count:', error);
        return of({ searchesLeft: this.guestSearchesLeft });
      })
    );
  }

  setLocalStorage(response) {
    const dateSplit = response.expiresIn.split(' ');
    const expiresAt = moment().add(dateSplit[0], dateSplit[1]);
    const user = new User;
        user.email = response['email'];
        user.firstName = response['firstName'];
        user.lastName = response['lastName'];
        user.role = response['role'];
        user.token = response['token'];
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);

    // Store token without adding Bearer prefix (it's already included in the response)
    localStorage.setItem('id_token', response.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
  }


  login(email: string, password: string) {
    return this.http.post(this.url +  '/login', {email, password}).pipe(
      map( res =>{
        this.setLocalStorage(res);
        return res;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.currentUserSubject.next(null);
    this.guestSearchesLeft = this.GUEST_SEARCH_LIMIT;  // Reset guest searches
  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() });
    httpParams = httpParams.append('email', email);

    return this.http.get<{ exists: boolean }>(this.url +  '/checkEmail', { params: httpParams });
  }


  changepassword(data){
    return this.http.post(this.url +  '/changepassword', data).pipe(
      map( res =>{
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        location.reload();
        return res;
      }));
  }

  register(newUser: SignUpForm) {
    //send a post request to the server to register the user
    //The server's users.js file will handle this request.
    return this.http.post(this.url +  '/signup', newUser, {responseType: 'text'});
  }

  public isVerifiedToAccess() {
    const curUser = this.currentUserSubject.value;
    if (this.isAuthenticated() && curUser) {
        // Special handling for guest users
        if (curUser.email === 'guest@digimedia.com') {
            return true;
        }

        let httpParams = new HttpParams({ encoder: new CustomHttpParamEncoder() });
        httpParams = httpParams.append('email', curUser.email);
        this.http.get<IsVerified>(this.url+ '/isVerified', {params: httpParams})
            .pipe(
                timeout(5000), // 5 second timeout
                catchError(error => {
                    console.error('Error checking verification:', error);
                    // Don't logout on timeout/network errors - just log the error
                    return of(null);
                })
            )
            .subscribe(
                res => {
                    if (res && res.isVerified) {
                        return;
                    } else if (res && !res.isVerified) {
                        this.logout();
                    }
                    // If res is null (timeout/error), do nothing - don't logout
                }
            );
    }
  }



  public isAuthenticated(): boolean {
    const currentUser = this.currentUserValue;
    if (!currentUser) {
      return false;
    }
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (!expiration) {
      return moment(0); // Return a moment in the past if no expiration
    }
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

}
