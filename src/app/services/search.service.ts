import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { Channel } from '../interfaces/channel';
import { Observable } from 'rxjs';
import { SearchInformation } from '../interfaces/search-information';
import { NewspaperTitle } from '../interfaces/newspaperTitle';
import { Country } from '../interfaces/country';
import { RadioStation } from '../interfaces/radioStation';
import { StateProvince } from '../interfaces/stateProvince';
import { City } from '../interfaces/city';
import { MagazineTitle } from '../interfaces/magazineTitle';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class SearchService {

  // url = 'http://192.168.1.154:3000';
  // url = 'http://localhost:3000';
  // url = 'http://localhost:3000';
  url = environment.serverUrl;
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  /**
   * Gets a list of all channels in database.
   * @returns {Observable<Channel[]>} - the list of channels
   */
  getChannels(): Observable<Channel[]>{
    return this.httpClient.get<Channel[]>(this.url+'/getChannels');
  }

  /**
   * Gets a list of all newspapers in database.
   * @returns {Observable<NewspaperTitle[]>} - the list of newspapers
   */
  getNewspapers(): Observable<NewspaperTitle[]>{
    return this.httpClient.get<NewspaperTitle[]>(this.url+'/getNewspapers');
  }

  /**
   * Gets a list of all magazines in database.
   * @returns {Observable<MagazineTitle[]>} - the list of magazines
   */
  getMagazines(): Observable<MagazineTitle[]>{
    return this.httpClient.get<MagazineTitle[]>(this.url+'/getMagazines');
  }


  /**
   * Gets a list of all radio stations in database.
   * @returns {Observable<RadioStation[]>} - the list of magazines
   */
  getRadios(): Observable<RadioStation[]>{
    return this.httpClient.get<RadioStation[]>(this.url+'/getRadios');
  }

  /**
   * Gets a list of all countries in database.
   * @returns {Observable<Country[]>} - the list of countries
   */
  getCountries(): Observable<Country[]>{
    return this.httpClient.get<Country[]>(this.url+'/getCountries');
  }

  /**
   * Gets a list of all states/provinces in database.
   * @returns {Observable<StateProvince[]>} - the list of state/provinces
   */
  getStates(): Observable<StateProvince[]>{
    return this.httpClient.get<StateProvince[]>(this.url+'/getStates');
  }

  /**
   * Gets a list of all cities in database.
   * @returns {Observable<City[]>} - the list of cities
   */
  getCities(): Observable<City[]>{
    return this.httpClient.get<City[]>(this.url+'/getCities');
  }

  /**
   * Gets a list of updated locations (countries, states/provinces, or cities) based on a selection.
   * @param {string} selectionType - the type of location that was chosen (country, state, or city)
   * @param {string} selection - the value of location selection
   * @param {string} updateType - the type of location that is needed to be updated (country, state, or city)
   * @return {Observable<any[]>} - the updated list of locations
   */
  updateLocations(selectionType: string, selection: string, updateType: string): Observable<any[]>{
    let params = new HttpParams();
    params = params.append('selectionType', selectionType);
    params = params.append('selection', selection);
    params = params.append('updateType', updateType);
    return this.httpClient.get<any[]>(this.url+'/updateLocations', {params});
  }
  /**
  * Gets an updated list of radio station based on a locational (country, state/province, or city) selection.
  * @param {string} country - the country selected
  * @param {string} state - the state or province selected
  * @param {string} city - the city selected
  * @returns {Observable<RadioStation[]>} - the list of radio station based on these selections
  */
  updateRadio(country: string, state: string, city: string): Observable<RadioStation[]>{
    let params = new HttpParams();
    params = params.append('country', country);
    params = params.append('state', state);
    params = params.append('city', city);
    return this.httpClient.get<RadioStation[]>(this.url+'/updateRadio', {params});
  }

  /**
   * Gets an updated list of newspapers based on a locational (country, state/province, or city) selection.
   * @param {string} country - the country selected
   * @param {string} state - the state or province selected
   * @param {string} city - the city selected
   * @returns {Observable<NewspaperTitle[]>} - the list of newspapers based on these selections
   */
  updateNewspapers(country: string, state: string, city: string): Observable<NewspaperTitle[]>{
    let params = new HttpParams();
    params = params.append('country', country);
    params = params.append('state', state);
    params = params.append('city', city);
    return this.httpClient.get<NewspaperTitle[]>(this.url+'/updateNewspapers', {params});
  }

  /**
   * Gets an updated list of magazines based on a locational (country, state/province, or city) selection.
   * @param {string} country - the country selected
   * @param {string} state - the state or province selected
   * @param {string} city - the city selected
   * @returns {Observable<MagazineTitle[]>} - the list of magazines based on these selections
   */
  updateMagazines(country: string, state: string, city: string): Observable<MagazineTitle[]>{
    let params = new HttpParams();
    params = params.append('country', country);
    params = params.append('state', state);
    params = params.append('city', city);
    return this.httpClient.get<MagazineTitle[]>(this.url+'/updateMagazines', {params});
  }

  /**
   * Searches for one or more phrases from the database.
   * @param {SearchInformation} searchInformation - the information to send to database.
   * @returns {Observable<any>} - a list of results
   */
  sendSearch(searchForm: any): Observable<any> {
    const url = `${this.url}/simpleSearch`;
    return this.httpClient.get(url, { params: this.buildSearchParams(searchForm) }).pipe(
      tap((response: any) => {
        // Update guest searches count if available in response
        if (response.searchesLeft !== undefined) {
          this.authService.updateGuestSearchesLeft(response.searchesLeft);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 && error.error?.searchesLeft !== undefined) {
          this.authService.updateGuestSearchesLeft(error.error.searchesLeft);
        }
        return throwError(() => error);
      })
    );
  }

  private buildSearchParams(searchForm: any): HttpParams {
    let params = new HttpParams();
    params = params.append('language', searchForm.language);
    params = params.append('searchQuery', searchForm.searchQuery);
    params = params.append('mediaType', searchForm.mediaType);
    params = params.append('selectedChannel', searchForm.selectedChannel);
    params = params.append('selectedNewspaper', searchForm.selectedNewspaper);
    params = params.append('selectedMagazine', searchForm.selectedMagazine);
    params = params.append('selectedSocialMedia', searchForm.selectedSocialMedia);
    params = params.append('selectedRadio', searchForm.selectedRadio);
    params = params.append('country', searchForm.country);
    params = params.append('stateProvince', searchForm.stateProvince);
    params = params.append('city', searchForm.city);
    params = params.append('startDateTime', searchForm.startDateTime);
    params = params.append('endDateTime', searchForm.endDateTime);
    params = params.append('startDate', searchForm.startDate);
    params = params.append('endDate', searchForm.endDate);
    params = params.append('startTime', searchForm.startTime);
    params = params.append('endTime', searchForm.endTime);
    params = params.append('numOfRecords', searchForm.numOfRecords.toString());
    return params;
  }

  getGuestSearchCount(): Observable<any> {
    return this.httpClient.get(`${this.url}/guestSearchCount`).pipe(
      tap((response: any) => {
        if (response.searchesLeft !== undefined) {
          this.authService.updateGuestSearchesLeft(response.searchesLeft);
        }
      }),
      catchError(error => {
        console.warn('Guest search count endpoint not available, using default limit.');
        // Default to the guest search limit defined in AuthService
        return of({ searchesLeft: this.authService.getGuestSearchesLeft() });
      })
    );
  }

}
