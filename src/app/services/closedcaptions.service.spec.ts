import { inject, TestBed } from '@angular/core/testing';

import { ClosedcaptionsService } from './closedcaptions.service';
import {HttpModule} from '@angular/http';

describe('ClosedcaptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [ClosedcaptionsService,]
    });
  });

  it('should be created', inject([ClosedcaptionsService], (service: ClosedcaptionsService) => {
    expect(service).toBeTruthy();
  }));
});
