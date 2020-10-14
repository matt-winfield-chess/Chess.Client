import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { SingleSquareMovementStrategy } from './single-square-movement-strategy';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';

describe('SingleSquareMovementStrategy', () => {
	it('should create an instance', () => {
		expect(new SingleSquareMovementStrategy(new BoardStateService(new FenParserService(new CoordinateNotationParserService())))).toBeTruthy();
	});
});
