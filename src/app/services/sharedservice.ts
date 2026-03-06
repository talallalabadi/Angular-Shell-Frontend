import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User} from '@/models/user';

@Injectable({providedIn: 'root'})
export class SharedService {
  url = 'http://192.168.1.154:3000';

  constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get<User[]>(this.url + '/users');
  }

  getById(id: number){
    return this.http.get<User[]>(this.url + `/users/${id}`);
  }


}
