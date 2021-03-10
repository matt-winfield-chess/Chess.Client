import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MoveHistoryComponent } from './move-history.component';

describe('MoveHistoryComponent', () => {
	let component: MoveHistoryComponent;
	let fixture: ComponentFixture<MoveHistoryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MoveHistoryComponent],
			imports: [RouterTestingModule]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MoveHistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
