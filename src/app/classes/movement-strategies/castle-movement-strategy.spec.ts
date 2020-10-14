import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { CastleMovementStrategy } from './castle-movement-strategy';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';

describe('CastleMovementStrategy', () => {
	it('should create an instance', () => {
		expect(new CastleMovementStrategy(new BoardStateService(new FenParserService(new CoordinateNotationParserService())))).toBeTruthy();
	});
});
