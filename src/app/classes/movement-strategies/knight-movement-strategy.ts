import { PlayerColor } from 'src/app/enums/player-color.enum';
import { Move } from '../move';
import { MoveValidationResult } from '../move-validation-result';
import { MovementStrategy } from './movement-strategy';

export class KnightMovementStrategy extends MovementStrategy {
	public isValidMove(move: Move, playerColor: PlayerColor): MoveValidationResult {
		if (!this.isSquareUsable(move.newX, move.newY, playerColor)) return { isValid: false, move: move };
		return { isValid: this.isSquareReachable(move), move: move };
	}

	private isSquareReachable(move: Move): boolean {
		if (Math.abs(move.newX - move.oldX) == 2 && Math.abs(move.newY - move.oldY) == 1) return true;
		if (Math.abs(move.newY - move.oldY) == 2 && Math.abs(move.newX - move.oldX) == 1) return true;
		return false;
	}
}
