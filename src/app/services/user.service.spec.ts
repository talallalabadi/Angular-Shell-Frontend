// External libraries
import { inject, TestBed } from '@angular/core/testing';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// Project components
import { UserService } from './user.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: XHRBackend, useClass: MockBackend },
        UserService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
