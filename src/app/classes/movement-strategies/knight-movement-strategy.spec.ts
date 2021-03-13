import { BoardStateService } from 'src/app/services/board-state.service';
import { KnightMovementStrategy } from './knight-movement-strategy';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('KnightMovementStrategy', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
	});

	it('should create an instance', () => {
		expect(new KnightMovementStrategy(TestBed.inject(BoardStateService))).toBeTruthy();
	});
});
