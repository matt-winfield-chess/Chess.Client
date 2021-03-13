import { BoardStateService } from 'src/app/services/board-state.service';
import { DiagonalMovementStrategy } from './diagonal-movement-strategy';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DiagonalMovementStrategy', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
	});

	it('should create an instance', () => {
		expect(new DiagonalMovementStrategy(TestBed.inject(BoardStateService))).toBeTruthy();
	});
});
