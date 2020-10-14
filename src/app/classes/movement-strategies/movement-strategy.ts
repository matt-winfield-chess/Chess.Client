import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';

export abstract class MovementStrategy {
	constructor(protected boardStateService: BoardStateService) { }

	public abstract isValidMove(oldX: number, oldY: number, newX: number, newY: number, playerColor: PlayerColor): boolean;

	protected isSquareUsable(x: number, y: number, playerColor: PlayerColor): boolean {
		let piece = this.boardStateService.getPieceOnSquare(x, y);
		return piece == null || piece?.color != playerColor;
	}
}
