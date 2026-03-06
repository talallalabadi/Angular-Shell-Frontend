// External libraries
import type { ComponentFixture} from '@angular/core/testing';
import { waitForAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

// Project components
import { AlertsComponent } from './alerts.component';
import { EmailAlertsService } from '../../services/email-alerts.service';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let compiled: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule
      ],
      declarations: [
        AlertsComponent
      ],
      providers: [
        {provide: XHRBackend, useClass: MockBackend},
        EmailAlertsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

// TODO: Figure out why XHRBackend doesn't play well with EmailAlertsService
  // it('should be created', () => {
  //   expect(component).toBeTruthy();
  // });
  //
  // it('should display "editing email alerts"', waitForAsync(() => {
  //   expect(compiled.querySelectorAll('.section-title')[0].textContent)
  //     .toMatch('create an email alert');
  // }));
  //
  // it('should display "editing email alerts"', waitForAsync(() => {
  //   expect(compiled.querySelectorAll('.section-title')[0].textContent)
  //     .toMatch('manage current email alerts');
  // }));
});
