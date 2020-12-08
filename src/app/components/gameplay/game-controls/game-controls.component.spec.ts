import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

import { GameControlsComponent } from './game-controls.component';

describe('GameControlsComponent', () => {
	let component: GameControlsComponent;
	let fixture: ComponentFixture<GameControlsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [GameControlsComponent],
			imports: [HttpClientModule, RouterTestingModule, ToastrModule.forRoot()],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GameControlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
