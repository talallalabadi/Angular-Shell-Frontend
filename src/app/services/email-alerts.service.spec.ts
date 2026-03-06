import { inject, TestBed } from '@angular/core/testing';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { EmailAlertsService } from './email-alerts.service';

describe('EmailAlertsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        EmailAlertsService
      ]
    });
  });

  it('should be created', inject([EmailAlertsService], (service: EmailAlertsService) => {
    expect(service).toBeTruthy();
  }));
});
