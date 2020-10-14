import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { MovementStrategy } from './movement-strategy';

export class PawnMovementStrategy extends MovementStrategy {
	constructor(protected boardStateService: BoardStateService) {
		super(boardStateService);
	}

	public isValidMove(oldX: number, oldY: number, newX: number, newY: number, playerColor: PlayerColor): boolean {
		if (!this.isSquareUsable(newX, newY, playerColor)) return false;
		if (!this.isMovingInCorrectDirection(oldY, newY, playerColor)) return false;
		if (this.isCapture(oldX, oldY, newX, newY, playerColor)) return true;
		return this.isValidMoveForward(oldX, oldY, newX, newY, playerColor);
	}

	private isMovingInCorrectDirection(oldY: number, newY: number, playerColor: PlayerColor) {
		let correctDirection = this.getCorrectMovementDirection(playerColor);
		return Math.sign(newY - oldY) == correctDirection
	}

	private isCapture(oldX: number, oldY: number, newX: number, newY: number, playerColor: PlayerColor): boolean {
		if (Math.abs(newX - oldX) != 1 || Math.abs(newY - oldY) != 1) return false;

		let capturedPiece = this.boardStateService.getPieceOnSquare(newX, newY);
		if (capturedPiece == null) return false;
		return capturedPiece.color != playerColor;
	}

	private isValidMoveForward(oldX: number, oldY: number, newX: number, newY: number, playerColor: PlayerColor) {
		if (oldX != newX) return false;
		let correctDirection = this.getCorrectMovementDirection(playerColor);
		let maxDistance = this.canMoveTwoSquares(oldY, playerColor) ? 2 : 1;

		let distance = newY - oldY;
		if (Math.sign(distance) != correctDirection) return false;

		if (this.isForwardMovementBlocked(oldX, oldY, maxDistance, correctDirection)) return false;

		return Math.abs(distance) > 0 && Math.abs(distance) <= maxDistance;
	}

	private getCorrectMovementDirection(playerColor: PlayerColor): number {
		return playerColor == PlayerColor.White ? -1 : 1;
	}

	private canMoveTwoSquares(oldY: number, playerColor: PlayerColor): boolean {
		if (playerColor == PlayerColor.White) {
			return oldY == 6;
		}
		return oldY == 1;
	}

	private isForwardMovementBlocked(oldX: number, oldY: number, maxDistance: number, correctDirection: number): boolean {
		for (let i = 1; i <= maxDistance; i++) {
			let piece = this.boardStateService.getPieceOnSquare(oldX, oldY + i * correctDirection);
			if (piece != null) return true;
		}
		return false;
	}
}
