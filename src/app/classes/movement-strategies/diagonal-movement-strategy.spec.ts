import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { DiagonalMovementStrategy } from './diagonal-movement-strategy';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';

describe('DiagonalMovementStrategy', () => {
	it('should create an instance', () => {
		expect(new DiagonalMovementStrategy(new BoardStateService(new FenParserService(new CoordinateNotationParserService())))).toBeTruthy();
	});
});
