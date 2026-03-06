// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Project components
import { LoginComponent } from './login.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let compiled: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        LoginComponent
    ],
    imports: [FormsModule],
    providers: [
        { provide: XHRBackend, useClass: MockBackend },
        UserService, AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Digiclips search engine"', waitForAsync(() => {
    expect(compiled.querySelector('.welcome-box').textContent)
      .toMatch('DigiClips search engine');
  }));

  it('should display the email input', waitForAsync(() => {
    expect(compiled.querySelector('#email-input')).not.toBeNull();
  }));

  it('should display the password input', waitForAsync(() => {
    expect(compiled.querySelector('#password-input')).not.toBeNull();
  }));

  it('should display the login button', waitForAsync(() => {
    expect(compiled.querySelector('#login-btn').textContent)
      .toMatch('login');
  }));

  it('should display the register link', waitForAsync(() => {
    expect(compiled.querySelector('#register-link').textContent)
      .toMatch('register');
  }));

  it('should display the forgot-password link', waitForAsync(() => {
    expect(compiled.querySelector('#forgot-password').textContent)
      .toMatch('forgot password?');
  }));
});
