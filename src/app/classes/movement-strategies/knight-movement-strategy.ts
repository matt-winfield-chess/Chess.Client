import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { MovementStrategy } from './movement-strategy';

export class KnightMovementStrategy extends MovementStrategy {
	constructor(protected boardStateService: BoardStateService) {
		super(boardStateService);
	}

	public isValidMove(oldX: number, oldY: number, newX: number, newY: number, playerColor: PlayerColor): boolean {
		if (!this.isSquareUsable(newX, newY, playerColor)) return false;
		return this.isSquareReachable(oldX, oldY, newX, newY);
	}

	private isSquareReachable(oldX: number, oldY: number, newX: number, newY: number): boolean {
		if (Math.abs(newX - oldX) == 2 && Math.abs(newY - oldY) == 1) return true;
		if (Math.abs(newY - oldY) == 2 && Math.abs(newX - oldX) == 1) return true;
		return false;
	}
}
