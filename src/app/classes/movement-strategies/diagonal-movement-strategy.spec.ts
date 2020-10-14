import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { DiagonalMovementStrategy } from './diagonal-movement-strategy';

describe('DiagonalMovementStrategy', () => {
	it('should create an instance', () => {
		expect(new DiagonalMovementStrategy(new BoardStateService(new FenParserService()))).toBeTruthy();
	});
});
