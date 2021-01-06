import { PieceType } from 'src/app/enums/piece-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { CastlingState } from '../castling-state';
import { Move } from '../move';
import { MoveValidationResult } from '../move-validation-result';
import { Piece } from '../piece';
import { MovementStrategy } from './movement-strategy';

export class CastleMovementStrategy extends MovementStrategy {
	public isValidMove(move: Move, playerColor: PlayerColor): MoveValidationResult {
		if (!this.isCastlingAvailable(move, playerColor)) return new MoveValidationResult({ isValid: false, move });
		if (this.isBlocked(move)) return new MoveValidationResult({ isValid: false, move });
		if (this.isThroughCheck(move, playerColor)) return new MoveValidationResult({ isValid: false, move });

		let rookMove = this.getRookMove(move);
		return new MoveValidationResult({ isValid: true, move, isCastleMove: true, castleRookMove: rookMove });
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

	private isThroughCheck(move: Move, color: PlayerColor): boolean {
		let piecePositions = this.boardStateService.getPiecePositions();

		if (BoardStateService.isSquareAttacked(move.oldX, move.oldY, color, piecePositions)) {
			return true;
		}

		for (let x: number = move.oldX; x != move.newX; x += Math.sign(move.newX - move.oldX)) {
			if (BoardStateService.isSquareAttacked(x, move.newY, color, piecePositions)) {
				return true;
			}
		}

		return false;
	}

	private getRookMove(move: Move): Move {
		if (move.newX == 2) { // Queenside castle
			return <Move>{
				oldX: 0,
				oldY: move.oldY,
				newX: 3,
				newY: move.oldY
			};
		}

		return <Move>{
			oldX: 7,
			oldY: move.oldY,
			newX: 5,
			newY: move.oldY
		};
	}
}
