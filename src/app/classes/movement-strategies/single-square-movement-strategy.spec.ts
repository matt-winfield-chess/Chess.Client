import { BoardStateService } from 'src/app/services/board-state.service';
import { SingleSquareMovementStrategy } from './single-square-movement-strategy';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SingleSquareMovementStrategy', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
	});

	it('should create an instance', () => {
		expect(new SingleSquareMovementStrategy(TestBed.inject(BoardStateService))).toBeTruthy();
	});
});
