import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, SignUpForm} from '../../services/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalVariables } from '../common/global-variables';

@Component({
  selector: 'app-register',
  templateUrl: './termsandservices.component.html',
  styleUrls: ['./termsandservices.component.scss']
})

export class termsandservicesComponent implements OnInit {

}
