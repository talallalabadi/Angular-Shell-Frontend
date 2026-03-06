// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Project components
import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let compiled: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        RegisterComponent
    ],
    imports: [RouterTestingModule,
        FormsModule],
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "registration"', waitForAsync(() => {
    expect(compiled.querySelector('.main-text-box').textContent)
      .toMatch('registration');
  }));

  it('should display the username input', waitForAsync(() => {
    expect(compiled.querySelector('#username-input')).not.toBeNull();
  }));

  it('should display the first name input', waitForAsync(() => {
    expect(compiled.querySelector('#first-name-input')).not.toBeNull();
  }));

  it('should display the last name input', waitForAsync(() => {
    expect(compiled.querySelector('#last-name-input')).not.toBeNull();
  }));

  it('should display the password input', waitForAsync(() => {
    expect(compiled.querySelector('#password-input')).not.toBeNull();
  }));

  it('should display the confirm password input', waitForAsync(() => {
    expect(compiled.querySelector('#confirm-password-input')).not.toBeNull();
  }));

  it('should display the register button', waitForAsync(() => {
    expect(compiled.querySelector('#register-btn')).not.toBeNull();
  }));

  it('should display the cancel button', waitForAsync(() => {
    expect(compiled.querySelector('#cancel-btn')).not.toBeNull();
  }));

  // TODO: unit test register()
});
