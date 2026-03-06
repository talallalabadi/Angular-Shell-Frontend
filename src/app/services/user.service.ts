
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User} from '@/models/user';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
  // url = 'http://localhost:3000';
  url = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get<User[]>(this.url + '/users');
  }

  getById(id: number){
    return this.http.get<User[]>(this.url + `/users/${id}`);
  }
}
