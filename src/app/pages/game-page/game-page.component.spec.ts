import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { Observable, of } from 'rxjs';

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
	}

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GamePageComponent],
			imports: [HttpClientModule, ToastrModule.forRoot()],
			providers: [
				{ provide: ActivatedRoute, useValue: activatedRouteStub }
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
