import {inject, TestBed} from '@angular/core/testing';

import {SearchService} from './search.service';
import {HttpModule} from '@angular/http';
import {ClosedcaptionsService} from './closedcaptions.service';

describe('SearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [SearchService, ClosedcaptionsService]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
});
