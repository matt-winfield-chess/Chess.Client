import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { GameHubSignalRService } from 'src/app/services/signal-r/game-hub-signal-r.service';

import { DrawOfferStatusComponent } from './draw-offer-status.component';

describe('DrawOfferStatusComponent', () => {
	let component: DrawOfferStatusComponent;
	let fixture: ComponentFixture<DrawOfferStatusComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DrawOfferStatusComponent],
			imports: [HttpClientModule, RouterTestingModule, ToastrModule.forRoot()],
			providers: [
				{ provide: GameHubSignalRService, useValue: jasmine.createSpyObj('GameHubSignalRService', ['onMethod']) }
			]
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
