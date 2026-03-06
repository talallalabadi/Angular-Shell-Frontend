import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css'],
    standalone: false
})
export class SurveyComponent implements OnInit{
    constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.isVerifiedToAccess();
   }

   ngOnInit() {
   }
}
