import type { ComponentFixture} from '@angular/core/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TransferComponent } from './mediatransfer.component';
import { MediaTransferService } from '../../../services/media-transfer.service';
import { ProgressSpinnerComponent } from '../../shared/progress-spinner/progress-spinner.component';

describe('TransferComponent', () => {
  let component: TransferComponent;
  let fixture: ComponentFixture<TransferComponent>;
  let mediaTransferServiceSpy: jasmine.SpyObj<MediaTransferService>;

  beforeEach(waitForAsync(() => {
    mediaTransferServiceSpy = jasmine.createSpyObj<MediaTransferService>(
      'MediaTransferService',
      ['createTransfer', 'downloadFile', 'checkFileExists', 'getDownloadUrl']
    );
    mediaTransferServiceSpy.createTransfer.and.returnValue(of({}));

    TestBed.configureTestingModule({
      declarations: [TransferComponent, ProgressSpinnerComponent],
      imports: [RouterTestingModule, FormsModule],
      providers: [{ provide: MediaTransferService, useValue: mediaTransferServiceSpy }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should reject upload when no files selected', () => {
    component.uploadFile();
    expect(component.errorMessage).toBe('Please select a file to upload');
  });

  it('should add a valid email once', () => {
    component.currentEmail = 'test@example.com';
    component.addEmailOnBlur();
    component.currentEmail = 'test@example.com';
    component.addEmailOnBlur();

    expect(component.recipientEmails).toEqual(['test@example.com']);
  });
});
