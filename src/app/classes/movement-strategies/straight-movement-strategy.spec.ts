import { BoardStateService } from 'src/app/services/board-state.service';
import { StraightMovementStrategy } from './straight-movement-strategy';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('StraightMovementStrategy', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
	});

	it('should create an instance', () => {
		expect(new StraightMovementStrategy(TestBed.inject(BoardStateService))).toBeTruthy();
	});
});
