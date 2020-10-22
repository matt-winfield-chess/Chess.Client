import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineGamePageComponent } from './offline-game-page.component';

describe('OfflineGamePageComponent', () => {
  let component: OfflineGamePageComponent;
  let fixture: ComponentFixture<OfflineGamePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineGamePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
