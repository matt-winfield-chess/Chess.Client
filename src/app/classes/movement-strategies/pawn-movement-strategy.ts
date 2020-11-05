import { PlayerColor } from 'src/app/enums/player-color.enum';
import { Move } from '../move';
import { MoveValidationResult } from '../move-validation-result';
import { MovementStrategy } from './movement-strategy';

export class PawnMovementStrategy extends MovementStrategy {
	public isValidMove(move: Move, playerColor: PlayerColor): MoveValidationResult {
		if (!this.isSquareUsable(move.newX, move.newY, playerColor)) return new MoveValidationResult({ isValid: false, move });
		if (!this.isMovingInCorrectDirection(move.oldY, move.newY, playerColor)) return new MoveValidationResult({ isValid: false, move });
		if (this.isEnPassantCapture(move))
			return new MoveValidationResult({
				isValid: true,
				move,
				isEnPassantCapture: true,
				isPromotion: this.isPromotion(move),
				shouldResetFiftyMoveRuleCounter: true
			});
		if (this.isCapture(move, playerColor))
			return new MoveValidationResult({
				isValid: true,
				move,
				isPromotion: this.isPromotion(move),
				shouldResetFiftyMoveRuleCounter: true
			});

		return new MoveValidationResult({
			isValid: this.isValidMoveForward(move, playerColor),
			move,
			isEnPassantTarget: this.isEnPassantTarget(move),
			isPromotion: this.isPromotion(move),
			shouldResetFiftyMoveRuleCounter: true
		});
	}

	private isMovingInCorrectDirection(oldY: number, newY: number, playerColor: PlayerColor): boolean {
		let correctDirection = this.getCorrectMovementDirection(playerColor);
		return Math.sign(newY - oldY) == correctDirection;
	}

	private isCapture(move: Move, playerColor: PlayerColor): boolean {
		if (Math.abs(move.newX - move.oldX) != 1 || Math.abs(move.newY - move.oldY) != 1) return false;

		let capturedPiece = this.boardStateService.getPieceOnSquare(move.newX, move.newY);
		if (capturedPiece == null) return false;
		return capturedPiece.color != playerColor;
	}

	private isEnPassantCapture(move: Move): boolean {
		let enPassantTargetSquare = this.boardStateService.getBoardState().enPassantTargetSquare;
		if (!enPassantTargetSquare) return false;
		if (enPassantTargetSquare[0] != move.oldX - 1 && enPassantTargetSquare[0] != move.oldX + 1) return false;
		if (Math.abs(move.newY - move.oldY) != 1) return false;
		return enPassantTargetSquare[0] == move.newX && enPassantTargetSquare[1] == move.newY;
	}

	private isValidMoveForward(move: Move, playerColor: PlayerColor): boolean {
		if (move.oldX != move.newX) return false;
		let correctDirection = this.getCorrectMovementDirection(playerColor);
		let maxDistance = this.canMoveTwoSquares(move.oldY, playerColor) ? 2 : 1;

		let distance = move.newY - move.oldY;
		if (Math.sign(distance) != correctDirection) return false;

		if (this.isForwardMovementBlocked(move.oldX, move.oldY, distance, correctDirection)) return false;

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

	private isForwardMovementBlocked(oldX: number, oldY: number, distance: number, correctDirection: number): boolean {
		for (let i = 1; i <= Math.abs(distance); i++) {
			let piece = this.boardStateService.getPieceOnSquare(oldX, oldY + i * correctDirection);
			if (piece != null) return true;
		}
		return false;
	}

	private isEnPassantTarget(move: Move): boolean {
		return Math.abs(move.newY - move.oldY) == 2;
	}

	private isPromotion(move: Move): boolean {
		return move.newY == 0 || move.newY == 7;
	}
}
