import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Newspaper} from '../add-newspaper/addNewspaper.component';
import {Magazine} from '../add-magazine/addMagazine.component';
import  {Radio} from '../add-radio/addRadio.component';
import { environment } from '../../environments/environment';
@Injectable()
export class AddMediaService {

  // url = 'http://localhost:3000';
  url = environment.serverUrl;
  constructor(private http: HttpClient) { }

  /**
   * Sends the newspaper information to be added to the database.
   * @param {Newspaper} newspaper - the newspaper information to send to database.
   */
  addNewspaperToDatabase(newspaper: Newspaper) {
      return this.http.post(this.url + '/addNewspaper',
        {name: newspaper.name,
              homeURL: newspaper.url,
              rssFeed: newspaper.rss,
              country: newspaper.country,
              stateProvince: newspaper.state,
              city: newspaper.city
        });
  }

  /**
   * Sends the magazine information to be added to the database.
   * @param {Magazine} magazine - the magazine information to send to database.
   */
  addMagazineToDatabase(magazine: Magazine) {
    return this.http.post(this.url + '/addMagazine',
      {name: magazine.name,
            homeURL: magazine.url,
            rssFeed: magazine.rss,
            country: magazine.country,
            stateProvince: magazine.state,
            city: magazine.city
      });
  }

  /**
   * Sends the radio station information to be added to the database.
   * @param {Radio} radio - the radio station information to send to database.
   */
  addRadioToDatabase(radio: Radio) {
    return this.http.post(this.url + '/addRadio',
      {name: radio.name,
            homeURL: radio.url,
            country: radio.country,
            stateProvince: radio.state,
            city: radio.city
      });
  }
}
