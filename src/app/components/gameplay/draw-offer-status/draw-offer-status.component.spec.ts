import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawOfferStatusComponent } from './draw-offer-status.component';

describe('DrawOfferStatusComponent', () => {
  let component: DrawOfferStatusComponent;
  let fixture: ComponentFixture<DrawOfferStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawOfferStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawOfferStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
