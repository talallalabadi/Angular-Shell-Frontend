// External Libraries
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';

// Project Components
import { VideoEditorComponent } from '../video-editor/video-editor.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../login/register/register.component';
import { ProfileComponent } from '../login/profile/profile.component';
import { ViewProfileComponent } from '../login/viewProfile/viewProfile.component';
import { AlertsComponent } from '../login/alerts/alerts.component';
import { SearchComponent } from '../search/search.component';
import { AddNewspaperComponent } from '../add-newspaper/addNewspaper.component';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { AuthGuard } from '../guards/auth.guard';
import { CustomizeLogoComponent } from '../customize-logo/customizeLogo.component';
import { AddMagazineComponent } from '../add-magazine/addMagazine.component';
import { AddRadioComponent } from '../add-radio/addRadio.component';
import { NewAlertsComponent } from '../login/newAlerts/newAlerts.component';
import { ContactUsComponent } from '../contactUs/contactUs.component';
import { HelpPageComponent } from '../helpPage/helpPage.component';
import { MediaAnalyticsComponent } from '../mediaAnalytics/mediaAnalytics.component';
import { TransferComponent } from '../media-transfer/pages/mediatransfer/mediatransfer.component';
import { TransferSuccessComponent } from '../media-transfer/pages/success/success.component';
import { TransferErrorComponent } from '../media-transfer/pages/error/error.component';
import { TransferRedirectComponent } from '../media-transfer/pages/redirect/redirect.component';
import { PasswordRecoveryComponent } from '../login/passwordRecovery/passwordRecovery.component';
import { SurveyComponent } from '../survey/survey.component';
import { DigichatComponent } from '../digichat/digichat.component';
import { LanguageTranslationComponent } from '../languageTranslation/languageTranslation.component'
import { Role } from '../models/role';
import { UnderConstructionComponent } from '../components/under-construction.component';
import { AdDebugComponent } from '../components/ad-debug/ad-debug.component';
import { LogoutPageComponent } from '../components/logout.component';
import { HelpPageComponent as HelpPageComponentNew } from '../components/help.component';
import { InformationPageComponent } from '../components/information.component';
import { AdministrationPageComponent } from '../components/administration.component';
import { AdminApprovalsComponent } from '../components/admin-approvals.component';
import { MainPageComponent } from '../main-page/main-page.component';




const routes: Routes = [
    { path: 'video-editor', component: VideoEditorComponent },
    {
        path: '',
        component: MainPageComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'passwordRecovery',
        component: PasswordRecoveryComponent,
        canActivate: [LoggedInGuard]
    },
    {
        path: 'profile',
        component: ViewProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'profile/change-password',
        component: ProfileComponent,   // your existing change password page
        canActivate: [AuthGuard]
    },
    {
        path: 'alerts',
        component: AlertsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'search',
        component: SearchComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'customizeLogo',
        component: CustomizeLogoComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'addNews',
        component: AddNewspaperComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'addMags',
        component: AddMagazineComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'addRads',
        component: AddRadioComponent,
        canActivate: [AuthGuard],
        data: {roles: [Role.Admin]}
    },
    {
        path: 'newAlerts',
        component: NewAlertsComponent,
        canActivate: [AuthGuard]
    },
    {
      path: 'contactUs',
      component: ContactUsComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'helpPage',
      component: HelpPageComponent,
      canActivate: [AuthGuard]
    },
        {
                path: 'survey',
                component: UnderConstructionComponent,
                canActivate: [AuthGuard]
            },
    {
        path: 'digichat',
        component: DigichatComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'mediaAnalytics',
        component: MediaAnalyticsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'mediaTransfer',
        component: TransferComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'mediaTransfer/success',
        component: TransferSuccessComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'mediaTransfer/error',
        component: TransferErrorComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'languageTranslation',
        component: LanguageTranslationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'ad-debug',
        component: AdDebugComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'media-download/:token',
        component: TransferRedirectComponent,
        // canActivate: [AuthGuard]
    },
    // Placeholder routes for Phase 1 submenu (post-login only)
    { path: 'general-public', component: UnderConstructionComponent, canActivate: [AuthGuard] },
    { path: 'subscriber', component: UnderConstructionComponent, canActivate: [AuthGuard] },
    // Make information accessible pre-login for demo (no guard)
    { path: 'information', component: InformationPageComponent },
    { path: 'administration', component: AdministrationPageComponent, canActivate: [AuthGuard] },
    { path: 'admin/approvals', component: AdminApprovalsComponent, canActivate: [AuthGuard] },
    { path: 'option', component: UnderConstructionComponent, canActivate: [AuthGuard] },
    // New placeholder routes for expanded Subscriber submenu
    { path: 'archiveMedia', component: UnderConstructionComponent, canActivate: [AuthGuard] },
    { path: 'mediaContacts', component: UnderConstructionComponent, canActivate: [AuthGuard] },
    { path: 'opinion', component: UnderConstructionComponent, canActivate: [AuthGuard] },
    {
        path: 'help',
        component: HelpPageComponentNew
    },
    {
        path: 'logout',
        component: LogoutPageComponent
    },

    // otherwise redirect to SearchComponent
    { path: '**', redirectTo: ''}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
