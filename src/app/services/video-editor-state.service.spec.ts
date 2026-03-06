import { TestBed } from '@angular/core/testing';

import { VideoEditorStateService } from './video-editor-state.service';

describe('VideoEditorStateService', () => {
  let service: VideoEditorStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoEditorStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
