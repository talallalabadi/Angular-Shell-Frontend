// External libraries
import { waitForAsync, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing'; //depreciated in angular 17->18
// import { XHRBackend } from "@angular/common/http";
import { HttpXhrBackend, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { MockBackend } from "@angular/common/http/testing"; DEPRECATED
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Project services
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        AppComponent
    ],
    imports: [RouterTestingModule],
    providers: [
        { provide: HttpXhrBackend },
        UserService,
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
