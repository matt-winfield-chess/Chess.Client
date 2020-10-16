import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSettingsModalComponent } from './game-settings-modal.component';

describe('GameSettingsModalComponent', () => {
  let component: GameSettingsModalComponent;
  let fixture: ComponentFixture<GameSettingsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSettingsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
