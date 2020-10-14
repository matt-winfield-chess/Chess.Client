import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { StraightMovementStrategy } from './straight-movement-strategy';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';

describe('StraightMovementStrategy', () => {
	it('should create an instance', () => {
		expect(new StraightMovementStrategy(new BoardStateService(new FenParserService(new CoordinateNotationParserService())))).toBeTruthy();
	});
});
