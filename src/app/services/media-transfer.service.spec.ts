import { TestBed } from '@angular/core/testing';

import { MediaTransferService } from './media-transfer.service';

describe('MediaTransferService', () => {
  let service: MediaTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
