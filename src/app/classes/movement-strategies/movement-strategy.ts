import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { Move } from '../move';
import { MoveValidationResult } from '../move-validation-result';

export abstract class MovementStrategy {
	constructor(protected boardStateService: BoardStateService) { }

	public abstract isValidMove(move: Move, playerColor: PlayerColor): MoveValidationResult;

	protected isSquareUsable(x: number, y: number, playerColor: PlayerColor): boolean {
		let piece = this.boardStateService.getPieceOnSquare(x, y);
		return piece == null || piece?.color != playerColor;
	}
}
