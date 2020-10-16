import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendChallengeModalComponent } from './send-challenge-modal.component';

describe('SendChallengeModalComponent', () => {
  let component: SendChallengeModalComponent;
  let fixture: ComponentFixture<SendChallengeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendChallengeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendChallengeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
