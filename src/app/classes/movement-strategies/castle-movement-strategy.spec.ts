import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { CastleMovementStrategy } from './castle-movement-strategy';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('CastleMovementStrategy', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule]
		});
	});

	it('should create an instance', () => {
		expect(new CastleMovementStrategy(TestBed.inject(BoardStateService))).toBeTruthy();
	});
});
