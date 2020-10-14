import { PieceType } from 'src/app/enums/piece-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { CastlingState } from '../castling-state';
import { Move } from '../move';
import { MoveValidationResult } from '../move-validation-result';
import { Piece } from '../piece';
import { MovementStrategy } from './movement-strategy';

export class CastleMovementStrategy extends MovementStrategy {
	public isValidMove(move: Move, playerColor: PlayerColor): MoveValidationResult {
		if (!this.isCastlingAvailable(move, playerColor)) return { isValid: false, move: move };
		return { isValid: !this.isBlocked(move), move: move };
	}

	private isCastlingAvailable(move: Move, playerColor: PlayerColor): boolean {
		let castlingState: CastlingState = this.boardStateService.getBoardState().castlingState;
		let piece: Piece = this.boardStateService.getPieceOnSquare(move.oldX, move.oldY);

		if (piece?.pieceType != PieceType.King) return false;
		if (move.newX != 2 && move.newX != 6) return false;

		if (playerColor == PlayerColor.White) {
			if (move.newY != 7) return false;
			if (move.newX == 2 && castlingState.whiteQueenside == false) return false;
			if (move.newX == 6 && castlingState.whiteKingside == false) return false;
			return true;
		}

		if (move.newY != 0) return false;
		if (move.newX == 2 && castlingState.blackQueenside == false) return false;
		return !(move.newX == 6 && castlingState.blackKingside == false);
	}

	private isBlocked(move: Move): boolean {
		if (move.newX == 2) {
			for (let x: number = 1; x <= 3; x++) {
				let piece = this.boardStateService.getPieceOnSquare(x, move.newY);
				if (piece != null) return true;
			}
		} else {
			for (let x: number = 5; x <= 6; x++) {
				let piece = this.boardStateService.getPieceOnSquare(x, move.newY);
				if (piece != null) return true;
			}
		}
		return false;
	}
}
