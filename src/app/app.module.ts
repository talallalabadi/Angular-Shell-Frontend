// External Libraries
import { BrowserModule, REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser'; //remove_styles was asked for on v178 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



// Project Sources
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { SearchComponent } from './search/search.component';
import { SearchService } from './services/search.service';
import { ClosedcaptionsService } from './services/closedcaptions.service';
import { SendEmailService } from './services/sendemail.service';
import { CustomizeLogoService } from './services/customizeLogo.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { LoggedInGuard } from './guards/logged-in.guard';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './login/profile/profile.component';
import { ViewProfileComponent } from './login/viewProfile/viewProfile.component';
import { AlertsComponent } from './login/alerts/alerts.component';
import { TransferComponent } from './media-transfer/pages/mediatransfer/mediatransfer.component';
import { EmailAlertsService } from './services/email-alerts.service';
import { AddNewspaperComponent } from './add-newspaper/addNewspaper.component';
import { AddMediaService } from './services/addmedia.service';
import { AddMagazineComponent } from './add-magazine/addMagazine.component';
import { AddRadioComponent } from './add-radio/addRadio.component';
import { NewAlertsComponent } from './login/newAlerts/newAlerts.component';
import { ContactUsComponent } from './contactUs/contactUs.component';
import { HelpPageComponent } from './helpPage/helpPage.component';
import { CustomizeLogoComponent } from './customize-logo/customizeLogo.component';
import { MediaAnalyticsComponent } from './mediaAnalytics/mediaAnalytics.component';
import { PasswordRecoveryComponent } from './login/passwordRecovery/passwordRecovery.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SurveyComponent } from './survey/survey.component';
import { ProgressSpinnerComponent } from './media-transfer/shared/progress-spinner/progress-spinner.component';
import { TransferSuccessComponent } from './media-transfer/pages/success/success.component';
import { TransferErrorComponent } from './media-transfer/pages/error/error.component';
import { TransferRedirectComponent } from './media-transfer/pages/redirect/redirect.component';
import { VideoEditorComponent } from './video-editor/video-editor.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DemoRequestModalComponent } from './components/demo-request-modal/demo-request-modal.component';
import { AdUnitComponent } from './components/ad-unit/ad-unit.component';
import { AdDebugComponent } from './components/ad-debug/ad-debug.component';
import { AdService } from './services/ad.service';
import { DigichatComponent } from './digichat/digichat.component';
import { DigichatService } from './services/digichat.service';
import { LanguageTranslationComponent } from './languageTranslation/languageTranslation.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AdministrationPageComponent } from './components/administration.component';
import { AdminApprovalsComponent } from './components/admin-approvals.component';

@NgModule({ declarations: [
        AppComponent,
        NavbarComponent,
        LoginComponent,
        RegisterComponent,
        PasswordRecoveryComponent,
        SearchComponent,
        ProfileComponent,
        AlertsComponent,
        TransferComponent,
        AddNewspaperComponent,
        AddMagazineComponent,
        AddRadioComponent,
        NewAlertsComponent,
        ContactUsComponent,
        HelpPageComponent,
        CustomizeLogoComponent,
        MediaAnalyticsComponent,
        SurveyComponent,
        VideoEditorComponent,
        DemoRequestModalComponent,
        AdUnitComponent,
        AdDebugComponent,
        ProgressSpinnerComponent,
        TransferSuccessComponent,
        TransferErrorComponent,
        TransferRedirectComponent,
        DigichatComponent,
        MainPageComponent,
        // Administration area
        AdministrationPageComponent,
        AdminApprovalsComponent
    
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        LanguageTranslationComponent,
        ReactiveFormsModule,
        NgChartsModule,
        NgMultiSelectDropDownModule,
        CollapseModule.forRoot(),
        AccordionModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        ButtonsModule.forRoot(),
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        ViewProfileComponent
    ],
    providers: [
        SearchService,
        ClosedcaptionsService,
        SendEmailService,
        UserService,
        AuthService,
        LoggedInGuard,
        AuthGuard,
        EmailAlertsService,
        AddMediaService,
        CustomizeLogoService,
        AdService,
        DigichatService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        { provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: false },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
