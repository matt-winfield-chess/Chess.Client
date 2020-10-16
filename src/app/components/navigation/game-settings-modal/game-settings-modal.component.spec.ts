import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { GameSettingsModalComponent } from './game-settings-modal.component';

describe('GameSettingsModalComponent', () => {
	let component: GameSettingsModalComponent;
	let fixture: ComponentFixture<GameSettingsModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GameSettingsModalComponent],
			imports: [HttpClientModule, ToastrModule.forRoot(), NgxSpinnerModule, RouterTestingModule, BrowserAnimationsModule],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GameSettingsModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	// Clean up tests so that they don't overlay results
	afterEach(() => {
		if (fixture.nativeElement && 'remove' in fixture.nativeElement) {
			(fixture.nativeElement as HTMLElement).remove();
		}
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
