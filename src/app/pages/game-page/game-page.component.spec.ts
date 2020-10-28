import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { GameHubSignalRService } from 'src/app/services/signal-r/game-hub-signal-r.service';

import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
	let component: GamePageComponent;
	let fixture: ComponentFixture<GamePageComponent>;
	const activatedRouteStub = {
		params: {
			subscribe(): Observable<any> {
				return of();
			}
		}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GamePageComponent],
			imports: [HttpClientModule, RouterTestingModule, ToastrModule.forRoot()],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRouteStub },
				{ provide: GameHubSignalRService, useValue: jasmine.createSpyObj('GameHubSignalRService', ['onMethod']) }
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GamePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
