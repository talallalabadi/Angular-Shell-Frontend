import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewProfileComponent } from './viewProfile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewProfileComponent', () => {
  let component: ViewProfileComponent;
  let fixture: ComponentFixture<ViewProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewProfileComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.exist;
  });
});
