import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { PawnMovementStrategy } from './pawn-movement-strategy';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PawnMovementStrategy', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
	});

	it('should create an instance', () => {
		expect(new PawnMovementStrategy(TestBed.inject(BoardStateService))).toBeTruthy();
	});
});
