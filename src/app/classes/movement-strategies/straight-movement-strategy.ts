import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { MovementStrategy } from './movement-strategy';

export class StraightMovementStrategy extends MovementStrategy {
	constructor(protected boardStateService: BoardStateService) {
		super(boardStateService);
	}

	public isValidMove(oldX: number, oldY: number, newX: number, newY: number, playerColor: PlayerColor): boolean {
		if (!this.isSquareUsable(newX, newY, playerColor)) return false;
		if (!this.isStraight(oldX, oldY, newX, newY)) return false;
		return !this.isBlocked(oldX, oldY, newX, newY);
	}

	private isStraight(oldX: number, oldY: number, newX: number, newY: number): boolean {
		return oldX == newX || oldY == newY;
	}

	private isBlocked(oldX: number, oldY: number, newX: number, newY: number): boolean {
		let xIncrement = Math.sign(newX - oldX);
		let yIncrement = Math.sign(newY - oldY);

		for (let step: number = 1; step < Math.abs(newX - oldX); step++) {
			let positionToCheck: [number, number] = [oldX + (step * xIncrement), oldY + (step * yIncrement)];

			let pieceAtPosition = this.boardStateService.getPieceOnSquare(positionToCheck[0], positionToCheck[1]);
			if (pieceAtPosition != null) return true;
		}
		return false;
	}
}
