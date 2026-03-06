import { waitForAsync, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Project components
import { LoggedInGuard } from './logged-in.guard';
import { AuthService } from '../services/auth.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [
        LoggedInGuard,
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should be created', inject([LoggedInGuard], (guard: LoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
