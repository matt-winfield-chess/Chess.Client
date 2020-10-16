import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { SendChallengeModalComponent } from './send-challenge-modal.component';

describe('SendChallengeModalComponent', () => {
	let component: SendChallengeModalComponent;
	let fixture: ComponentFixture<SendChallengeModalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SendChallengeModalComponent],
			imports: [HttpClientModule, ToastrModule.forRoot(), NgxSpinnerModule, RouterTestingModule, BrowserAnimationsModule],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SendChallengeModalComponent);
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
