import { waitForAsync, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Project components
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [
        AuthGuard,
        AuthService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should be created', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
