import { PlayerColor } from 'src/app/enums/player-color.enum';
import { Move } from '../move';
import { MoveValidationResult } from '../move-validation-result';
import { MovementStrategy } from './movement-strategy';

export class DiagonalMovementStrategy extends MovementStrategy {
	isValidMove(move: Move, playerColor: PlayerColor): MoveValidationResult {
		if (!this.isSquareUsable(move.newX, move.newY, playerColor)) return { isValid: false, move: move };
		if (!this.isDiagonal(move)) return { isValid: false, move: move };
		return { isValid: !this.isBlocked(move), move: move };
	}

	private isDiagonal(move: Move): boolean {
		return Math.abs(move.newX - move.oldX) == Math.abs(move.newY - move.oldY);
	}

	private isBlocked(move: Move): boolean {
		let xIncrement = Math.sign(move.newX - move.oldX);
		let yIncrement = Math.sign(move.newY - move.oldY);

		for (let step: number = 1; step < Math.abs(move.newX - move.oldX); step++) {
			let positionToCheck: [number, number] = [move.oldX + (step * xIncrement), move.oldY + (step * yIncrement)];

			let pieceAtPosition = this.boardStateService.getPieceOnSquare(positionToCheck[0], positionToCheck[1]);
			if (pieceAtPosition != null) return true;
		}
		return false;
	}
}
