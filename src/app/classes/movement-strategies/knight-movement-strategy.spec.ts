import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { KnightMovementStrategy } from './knight-movement-strategy';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';

describe('KnightMovementStrategy', () => {
	it('should create an instance', () => {
		expect(new KnightMovementStrategy(new BoardStateService(new FenParserService(new CoordinateNotationParserService())))).toBeTruthy();
	});
});
