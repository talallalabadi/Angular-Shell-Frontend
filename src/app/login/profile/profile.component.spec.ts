// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Project components
import { ProfileComponent } from './profile.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let compiled: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        ProfileComponent
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
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "editing user profile"', waitForAsync(() => {
    expect(compiled.querySelector('.main-text-box').textContent)
      .toMatch('editing user profile');
  }));

  it('should display the current password input', waitForAsync(() => {
    expect(compiled.querySelector('#current-password-input')).not.toBeNull();
  }));

  it('should display the new password input', waitForAsync(() => {
    expect(compiled.querySelector('#new-password-input')).not.toBeNull();
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
});
