import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Role } from './models/role';
import { User } from './models/user';
import { GlobalVariables } from './common/global-variables';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  currentUser: User;
  public static logoImage = null;
  public ShowNavbar: boolean = true;

  constructor(private router: Router, public auth: AuthService, private http: HttpClient) {
      this.auth.currentUser.subscribe(x => this.currentUser = x);
      this.auth.isVerifiedToAccess();
      this.router.events.subscribe(event =>{
        if (event instanceof NavigationEnd) {
          this.ShowNavbar =! event.url.includes("/register") && !event.url.includes("/passwordRecovery");
        }
      });
  }

  ngOnInit(): void {
    // this.http.get('/requestLogo')
    //   .subscribe(res => {
    //     AppComponent.logoImage = res;
    //   });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }

  get isAccountVerifier() {
    if (this.currentUser) {
      return this.currentUser.email === 'bobshapiro40@gmail.com' || this.currentUser.email === 'demo@gmail.com' || this.currentUser.email === 'hbremers@gmail.com';
    } else {
      return false;
    }
  }

  getCompanyName() {
    return GlobalVariables.companyName;
  }

  getCompanyLogo() {
    return AppComponent.logoImage;
  }

  logout(): void {
    this.auth.logout();
  }

  // Navigation methods maintained for backward compatibility
  navigateToSearch() {
    const currentRoute = this.router.url;
    if (currentRoute === '/search') {
      location.reload();
    } else {
      this.router.navigate(['/search']);
    }
  }

  navigateToAlerts(){
    const currentRoute = this.router.url;
    if(currentRoute == '/alerts'){
      location.reload();
    }else{
      this.router.navigate(['/alerts']);
    }
  }

  navigateToMedia(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaAnalytics'){
      location.reload();
    }else{
      this.router.navigate(['/mediaAnalytics']);
    }
  }

  navigateToTransfer(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer']);
    }
  }

  navigateToTransferSuccess(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer/success'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer/success']);
    }
  }

  navigateToTransferError(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer/error'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer/error']);
    }
  }

  navigateToTransferRedirect(){
    const currentRoute = this.router.url;
    if(currentRoute == '/mediaTransfer/redirect'){
      location.reload();
    }else{
      this.router.navigate(['/mediaTransfer/redirect']);
    }
  }

  navigateToUser() {
    this.router.navigate(['/profile']);
  }


  navigateToContact(){
    const currentRoute = this.router.url;
    if(currentRoute == '/contactUs'){
      location.reload();
    }else{
      this.router.navigate(['/contactUs']);
    }
  }

  navigateToHelp(){
    const currentRoute = this.router.url;
    if(currentRoute == '/helpPage'){
      location.reload();
    }else{
      this.router.navigate(['/helpPage']);
    }
  }

  navigateToSurvey(){
    const currentRoute = this.router.url;
    if(currentRoute == '/survey'){
      location.reload();
    }else{
      this.router.navigate(['/survey']);
    }
  }

  navigateToTranslation() {
    const currentRoute = this.router.url;
    if (currentRoute === '/languageTranslation') {
      location.reload();
    } else {
      this.router.navigate(['/languageTranslation']);
    }
  }

  navigateToDigiChat(){
    const currentRoute = this.router.url;
    if(currentRoute == '/digichat'){
      location.reload();
    }else{
      this.router.navigate(['/digichat']);
    }
  }
}
