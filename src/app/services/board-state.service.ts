import { Inject, Injectable } from '@angular/core';
import { BoardState } from '../classes/board-state';
import { Piece } from '../classes/piece';
import { PieceType } from '../enums/piece-type.enum';
import { PlayerColor } from '../enums/player-color.enum';
import { FenParserService } from './fen-parser.service';

@Injectable({
	providedIn: 'root'
})
export class BoardStateService {

	private boardState: BoardState;
	private piecePositions: Piece[][]; // stores piece at it's current position for more efficient retrieval by x/y coordinate

	constructor(@Inject(FenParserService) private fenParserService: FenParserService) {
		this.initialiseBoardState(this.fenParserService.parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
	}

	public initialiseBoardState(boardState: BoardState): void {
		this.boardState = boardState;
		this.synchronizeInternalPiecePositionsToBoardState();
	}

	public getPieceOnSquare(x: number, y: number): Piece {
		return this.piecePositions[y][x];
	}

	public getBoardState(): BoardState {
		return this.boardState;
	}

	public notifyMove(oldX: number, oldY: number, newX: number, newY: number): void {
		var piece = this.piecePositions[oldY][oldX];

		if (piece) {
			if (!this.isLegalMove(piece, newX, newY)) return;

			piece.x = newX;
			piece.y = newY;

			this.piecePositions[oldY][oldX] = null;
			this.piecePositions[newY][newX] = piece;

			this.updateBoardStateCounters();
			this.updateCastlingRights(piece, oldX, oldY);
		}
	}

	private isLegalMove(piece: Piece, newX: number, newY: number) {
		if (piece.x == newX && piece.y == newY) return false;
		if (piece.color != this.boardState.activeColor) return false;

		for (let movementStrategy of piece.movementStrategies) {
			let movementValidationResult = movementStrategy.isValidMove({
				oldX: piece.x,
				oldY: piece.y,
				newX: newX,
				newY: newY
			}, piece.color);

			if (movementValidationResult.isValid) {
				return true;
			}
		}
		return false;
	}

	private updateCastlingRights(piece: Piece, oldX: number, oldY: number): void {
		this.updateCastlingRightsForKingMovement(piece);
		this.updateCastlingRightsForRookMovement(piece, oldX, oldY);
	}

	private updateCastlingRightsForKingMovement(piece: Piece): void {
		if (piece.pieceType == PieceType.King) {
			if (piece.color == PlayerColor.White) {
				this.boardState.castlingState.whiteKingside = false;
				this.boardState.castlingState.whiteQueenside = false;
			} else {
				this.boardState.castlingState.blackKingside = false;
				this.boardState.castlingState.blackQueenside = false;
			}
		}
	}

	private updateCastlingRightsForRookMovement(piece: Piece, oldX: number, oldY: number): void {
		if (piece.pieceType == PieceType.Rook) {
			if (piece.color = PlayerColor.White) {
				if (oldX == 0 && oldY == 7) {
					this.boardState.castlingState.whiteQueenside = false;
				} else if (oldX == 7 && oldY == 7) {
					this.boardState.castlingState.whiteKingside = false;
				}
			} else {
				if (oldX == 0 && oldY == 0) {
					this.boardState.castlingState.blackQueenside = false;
				} else if (oldX == 7 && oldY == 0) {
					this.boardState.castlingState.blackKingside = false;
				}
			}
		}
	}

	private synchronizeInternalPiecePositionsToBoardState(): void {
		this.resetInternalPiecePositions();
		for (let piece of this.boardState.pieces) {
			this.piecePositions[piece.y][piece.x] = piece;
		}
	}

	private updateBoardStateCounters(): void {
		if (this.boardState.activeColor == PlayerColor.Black) {
			this.boardState.fullmoveNumber += 1;
		}
		this.boardState.activeColor = this.boardState.activeColor == PlayerColor.White ? PlayerColor.Black : PlayerColor.White;
	}

	private resetInternalPiecePositions(): void {
		this.piecePositions = [];

		for (let y: number = 0; y < 8; y++) {
			this.piecePositions.push([]);
			for (let x: number = 0; x < 8; x++) {
				this.piecePositions[y].push(null);
			}
		}
	}
}
