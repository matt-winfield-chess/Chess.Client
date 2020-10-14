import { Inject, Injectable } from '@angular/core';
import { BoardState } from '../classes/board-state';
import { Move } from '../classes/move';
import { MoveValidationResult } from '../classes/move-validation-result';
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
			let movementValidationResult = this.ValidateMove(piece, newX, newY);
			if (!movementValidationResult.isValid) return;

			this.applyMove(movementValidationResult.move);

			if (movementValidationResult.isCastleMove) {
				this.applyMove(movementValidationResult.castleRookMove);
			}

			this.updateBoardStateCounters();
			this.updateCastlingRights(piece, oldX, oldY);
		}
	}

	private ValidateMove(piece: Piece, newX: number, newY: number): MoveValidationResult {
		if (piece.x == newX && piece.y == newY) return new MoveValidationResult({ isValid: false });
		if (piece.color != this.boardState.activeColor) return new MoveValidationResult({ isValid: false });

		let outputResult = new MoveValidationResult({ isValid: false });

		for (let movementStrategy of piece.movementStrategies) {
			let movementValidationResult = movementStrategy.isValidMove({
				oldX: piece.x,
				oldY: piece.y,
				newX: newX,
				newY: newY
			}, piece.color);

			if (movementValidationResult.isValid) {
				outputResult = this.handleSuccessfulMovementValidationResult(movementValidationResult, piece);
			}
		}
		return outputResult;
	}

	private applyMove(move: Move) {
		var piece = this.piecePositions[move.oldY][move.oldX];

		this.removeCapturedPiece(move);

		piece.x = move.newX;
		piece.y = move.newY;

		this.piecePositions[move.oldY][move.oldX] = null;
		this.piecePositions[move.newY][move.newX] = piece;
	}

	private removeCapturedPiece(move: Move) {
		let capturedPiece = this.piecePositions[move.newY][move.newX];
		if (capturedPiece != null) {
			let index = this.boardState.pieces.indexOf(capturedPiece);
			this.boardState.pieces.splice(index, 1);
		}
	}

	private handleSuccessfulMovementValidationResult(movementValidationResult: MoveValidationResult, piece: Piece): MoveValidationResult {
		let move = movementValidationResult.move;
		let movementDirection = piece.color == PlayerColor.White ? -1 : 1;

		let outputResult = new MoveValidationResult({
			isValid: true,
			move: move
		});

		if (movementValidationResult.isCastleMove) {
			outputResult.isCastleMove = true;
			outputResult.castleRookMove = movementValidationResult.castleRookMove;
		}

		if (movementValidationResult.isEnPassantCapture) {
			let capturedPiece: Piece = this.getPieceOnSquare(this.boardState.enPassantTargetSquare[0], this.boardState.enPassantTargetSquare[1] - movementDirection);
			this.removeEnPassantCapturedPiece(capturedPiece);
		}

		if (movementValidationResult.isEnPassantTarget) {
			this.boardState.enPassantTargetSquare = [move.newX, (move.oldY + move.newY) / 2]
		} else {
			this.boardState.enPassantTargetSquare = null;
		}

		return outputResult;
	}

	private removeEnPassantCapturedPiece(piece: Piece) {
		this.piecePositions[piece.y][piece.x] = null;
		let index = this.boardState.pieces.indexOf(piece);
		this.boardState.pieces.splice(index, 1);
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
			if (piece.color == PlayerColor.White) {
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
