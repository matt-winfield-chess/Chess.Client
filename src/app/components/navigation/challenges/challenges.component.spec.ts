import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ConfigService } from 'src/app/services/config/config.service';
import { ChallengeHubSignalRService } from 'src/app/services/signal-r/challenge-hub-signal-r.service';
import { NavbarButtonComponent } from '../navbar-button/navbar-button.component';

import { ChallengesComponent } from './challenges.component';

describe('ChallengesComponent', () => {
	let component: ChallengesComponent;
	let fixture: ComponentFixture<ChallengesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ChallengesComponent, NavbarButtonComponent],
			imports: [HttpClientModule, ToastrModule.forRoot(), NgxSpinnerModule, RouterTestingModule, BrowserAnimationsModule],
			providers: [
				{ provide: ChallengeHubSignalRService, useValue: jasmine.createSpyObj('ChallengeHubSignalRService', ['onMethod']) },
				{ provide: ConfigService, useValue: jasmine.createSpyObj('ConfigService', ['getHost', 'getApiEndpoint', 'load']) }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChallengesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
