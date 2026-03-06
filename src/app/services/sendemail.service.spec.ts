import { inject, TestBed } from '@angular/core/testing';

import { SendEmailService } from './sendemail.service';
import {HttpModule} from '@angular/http';

describe('SendEmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [SendEmailService]
    });
  });

  it('should be created', inject([SendEmailService], (service: SendEmailService) => {
    expect(service).toBeTruthy();
  }));
});
