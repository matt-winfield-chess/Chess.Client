import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ComputerGamePageComponent } from './computer-game-page.component';

describe('ComputerGamePageComponent', () => {
	let component: ComputerGamePageComponent;
	let fixture: ComponentFixture<ComputerGamePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ComputerGamePageComponent],
			imports: [RouterTestingModule]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ComputerGamePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
