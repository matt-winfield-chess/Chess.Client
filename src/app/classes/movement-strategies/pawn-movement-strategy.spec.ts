import { BoardStateService } from 'src/app/services/board-state.service';
import { FenParserService } from 'src/app/services/fen-parser.service';
import { PawnMovementStrategy } from './pawn-movement-strategy';

describe('PawnMovementStrategy', () => {
	it('should create an instance', () => {
		expect(new PawnMovementStrategy(new BoardStateService(new FenParserService()))).toBeTruthy();
	});
});
