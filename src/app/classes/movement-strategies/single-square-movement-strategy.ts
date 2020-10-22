import { PlayerColor } from 'src/app/enums/player-color.enum';
import { Move } from '../move';
import { MoveValidationResult } from '../move-validation-result';
import { MovementStrategy } from './movement-strategy';

export class SingleSquareMovementStrategy extends MovementStrategy {
	public isValidMove(move: Move, playerColor: PlayerColor): MoveValidationResult {
		if (!this.isSquareUsable(move.newX, move.newY, playerColor)) return new MoveValidationResult({ isValid: false, move });
		return new MoveValidationResult({ isValid: this.isSquareReachable(move), move });
	}

	private isSquareReachable(move: Move): boolean {
		return Math.abs(move.newX - move.oldX) <= 1 && Math.abs(move.newY - move.oldY) <= 1;
	}
}
