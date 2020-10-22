import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
	private playerColor: PlayerColor = null;

	private moveSubscribers: ((move: Move) => void)[] = [];

	constructor(@Inject(FenParserService) private fenParserService: FenParserService, @Inject(Router) private router: Router) {
		this.setBoardToStandardStartingPosition();
		this.router.events.subscribe((event) => {
			this.setBoardToStandardStartingPosition();
		});
	}

	public setBoardToStandardStartingPosition(): void {
		this.initialiseBoardState(this.fenParserService.parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'));
	}

	public initialiseBoardState(boardState: BoardState): void {
		this.boardState = boardState;
		this.synchronizeInternalPiecePositionsToBoardState();
	}

	public setPlayerColor(color: PlayerColor): void {
		this.playerColor = color;
	}

	public getPieceOnSquare(x: number, y: number): Piece {
		return this.piecePositions[y][x];
	}

	public getBoardState(): BoardState {
		return this.boardState;
	}

	public subscribeToMoves(onMove: (move: Move) => void): void {
		this.moveSubscribers.push(onMove);
	}

	public notifyMove(oldX: number, oldY: number, newX: number, newY: number): void {
		let piece = this.piecePositions[oldY][oldX];

		if (piece) {
			let movementValidationResult = this.ValidateMove(piece, newX, newY);
			if (!movementValidationResult.isValid) return;

			this.handleEnPassant(piece, movementValidationResult);

			this.applyMove(movementValidationResult.move);

			if (movementValidationResult.isCastleMove) {
				this.applyMove(movementValidationResult.castleRookMove);
			}

			this.handlePromotion(movementValidationResult);

			this.updateBoardStateCounters();
			this.updateCastlingRights(piece, oldX, oldY);
		}
	}

	public getLegalMoves(piece: Piece): Move[] {
		let legalMoves: Move[] = [];
		if (piece.color != this.boardState.activeColor) return legalMoves;

		for (let x: number = 0; x < 8; x++) {
			for (let y: number = 0; y < 8; y++) {
				let validationResult = this.ValidateMove(piece, x, y, true);
				if (validationResult.isValid) {
					legalMoves.push({
						oldX: piece.x,
						oldY: piece.y,
						newX: x,
						newY: y
					});
				}
			}
		}

		return legalMoves;
	}

	public isKingInCheck(kingColor: PlayerColor, board: Piece[][] = this.piecePositions): boolean {
		let opponentColor: PlayerColor = kingColor == PlayerColor.White ? PlayerColor.Black : PlayerColor.White;

		let isKingPredicate = (piece: Piece) => piece?.pieceType == PieceType.King && piece?.color == kingColor;

		let kingY = board.findIndex(rank => rank.some(isKingPredicate));
		if (kingY === undefined) return false;

		let kingX = board[kingY].findIndex(isKingPredicate);
		if (kingX === undefined) return false;

		if (this.isKingAttackedInStraightLine(kingX, kingY, opponentColor, board)) return true;
		if (this.isKingAttackedDiagonally(kingX, kingY, opponentColor, board)) return true;
		if (this.isKingAttackedByPawn(kingX, kingY, opponentColor, board)) return true;
		if (this.isKingAttackedByKnight(kingX, kingY, opponentColor, board)) return true;
		if (this.isKingAttackedByKing(kingX, kingY, opponentColor, board)) return true;

		return false;
	}

	public getDuplicateBoard(): Piece[][] {
		let output: Piece[][] = [];
		for (let y: number = 0; y < 8; y++) {
			output.push([]);
			for (let x: number = 0; x < 8; x++) {
				output[y].push(this.piecePositions[y][x]);
			}
		}
		return output;
	}

	public applyTestMove(move: Move, board: Piece[][]): void {
		let piece = board[move.oldY][move.oldX];

		board[move.oldY][move.oldX] = null;
		board[move.newY][move.newX] = piece;
	}

	private ValidateMove(piece: Piece, newX: number, newY: number, ignoreColor: boolean = false): MoveValidationResult {
		if (piece.x == newX && piece.y == newY) return new MoveValidationResult({ isValid: false });
		if (piece.color != this.boardState.activeColor && !ignoreColor) return new MoveValidationResult({ isValid: false });
		if (this.playerColor !== null && piece.color != this.playerColor && !ignoreColor) return new MoveValidationResult({ isValid: false });

		for (let movementStrategy of piece.movementStrategies) {
			let movementValidationResult = movementStrategy.isValidMove({
				oldX: piece.x,
				oldY: piece.y,
				newX,
				newY
			}, piece.color);

			if (movementValidationResult.isValid) {
				let testBoard = this.getDuplicateBoard();
				this.applyTestMove(movementValidationResult.move, testBoard);

				if (this.isKingInCheck(piece.color, testBoard)) {
					movementValidationResult.isValid = false;
				} else {
					this.notifyMoveSubscribersOfMove(movementValidationResult.move);
				}
				return movementValidationResult;
			}
		}
		return new MoveValidationResult({ isValid: false });
	}

	private applyMove(move: Move): void {
		let piece = this.piecePositions[move.oldY][move.oldX];

		this.removeCapturedPiece(move);

		piece.x = move.newX;
		piece.y = move.newY;

		this.piecePositions[move.oldY][move.oldX] = null;
		this.piecePositions[move.newY][move.newX] = piece;
	}

	private removeCapturedPiece(move: Move): void {
		let capturedPiece = this.piecePositions[move.newY][move.newX];
		if (capturedPiece != null) {
			let index = this.boardState.pieces.indexOf(capturedPiece);
			this.boardState.pieces.splice(index, 1);
		}
	}

	private handleEnPassant(piece: Piece, movementValidationResult: MoveValidationResult): void {
		let movementDirection = piece.color == PlayerColor.White ? -1 : 1;

		if (movementValidationResult.isEnPassantCapture) {
			let capturedPiece: Piece = this.getPieceOnSquare(this.boardState.enPassantTargetSquare[0],
				this.boardState.enPassantTargetSquare[1] - movementDirection);
			this.removeIndirectlyCapturedPiece(capturedPiece);
		}

		if (movementValidationResult.isEnPassantTarget) {
			this.boardState.enPassantTargetSquare = [movementValidationResult.move.newX, (piece.y + movementValidationResult.move.newY) / 2];
		} else {
			this.boardState.enPassantTargetSquare = null;
		}
	}

	private handlePromotion(moveValidationResult: MoveValidationResult): void {
		if (!moveValidationResult.isPromotion) return;
		let move = moveValidationResult.move;
		let pawn = this.getPieceOnSquare(move.newX, move.newY);

		this.removeIndirectlyCapturedPiece(pawn);
		this.addPiece(move.newX, move.newY, PieceType.Queen, pawn.color);
	}

	private removeIndirectlyCapturedPiece(piece: Piece): void {
		this.piecePositions[piece.y][piece.x] = null;
		let index = this.boardState.pieces.indexOf(piece);
		this.boardState.pieces.splice(index, 1);
	}

	private addPiece(x: number, y: number, pieceType: PieceType, color: PlayerColor): void {
		let piece = new Piece();
		piece.pieceType = pieceType;
		piece.color = color;
		piece.x = x;
		piece.y = y;

		this.piecePositions[y][x] = piece;
		this.boardState.pieces.push(piece);
	}

	private notifyMoveSubscribersOfMove(move: Move): void {
		for (let moveSubscriber of this.moveSubscribers) {
			moveSubscriber(move);
		}
	}

	private isKingAttackedInStraightLine(kingX: number, kingY: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		let validPieces = [PieceType.Queen, PieceType.Rook];
		if (this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, 1, 0, validPieces)) return true;
		if (this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, -1, 0, validPieces)) return true;
		if (this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, 0, 1, validPieces)) return true;
		return this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, 0, -1, validPieces);
	}

	private isKingAttackedDiagonally(kingX: number, kingY: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		let validPieces = [PieceType.Queen, PieceType.Bishop];

		if (this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, 1, 1, validPieces)) return true;
		if (this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, 1, -1, validPieces)) return true;
		if (this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, -1, 1, validPieces)) return true;
		return this.isKingAttackedByLineOfSightPiece(kingX, kingY, opponentColor, board, -1, -1, validPieces);
	}

	private isKingAttackedByLineOfSightPiece(kingX: number, kingY: number, opponentColor: PlayerColor, board: Piece[][],
		xIncrement: number, yIncrement: number, validPieces: PieceType[]): boolean {
		let x = kingX + xIncrement;
		let y = kingY + yIncrement;

		while (x >= 0 && x < 8 && y >= 0 && y < 8) {
			let piece = board[y][x];
			if (piece != null) {
				if (piece.color == opponentColor) {
					if (validPieces.some(type => piece.pieceType == type)) {
						return true;
					}
					break;
				} else {
					break;
				}
			}
			x += xIncrement;
			y += yIncrement;
		}
		return false;
	}

	private isKingAttackedByPawn(kingX: number, kingY: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		let opponentMovementDirection = opponentColor == PlayerColor.White ? -1 : 1;

		if (kingY - opponentMovementDirection < 0) return false;

		if (kingX - 1 >= 0) {
			let candidateAttacker1 = board[kingY - opponentMovementDirection][kingX - 1];
			if (candidateAttacker1 != null && candidateAttacker1.pieceType == PieceType.Pawn && candidateAttacker1.color == opponentColor) {
				return true;
			}
		}

		if (kingX + 1 < 8) {
			let candidateAttacker2 = board[kingY - opponentMovementDirection][kingX + 1];
			if (candidateAttacker2 != null && candidateAttacker2.pieceType == PieceType.Pawn && candidateAttacker2.color == opponentColor) {
				return true;
			}
		}

		return false;
	}

	private isKingAttackedByKnight(kingX: number, kingY: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		if (this.doesSquareHaveOpponentKnight(kingX + 2, kingY + 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(kingX + 2, kingY - 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(kingX - 2, kingY + 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(kingX - 2, kingY - 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(kingX + 1, kingY + 2, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(kingX + 1, kingY - 2, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(kingX - 1, kingY + 2, opponentColor, board)) return true;
		return this.doesSquareHaveOpponentKnight(kingX - 1, kingY - 2, opponentColor, board);
	}

	private doesSquareHaveOpponentKnight(x: number, y: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		if (x < 0 || x >= 8 || y < 0 || y >= 8) return false;
		let piece = board[y][x];
		if (piece == null) return false;
		return piece.pieceType == PieceType.Knight && piece.color == opponentColor;
	}

	private isKingAttackedByKing(kingX: number, kingY: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		for (let x = kingX - 1; x <= kingX + 1; x++) {
			for (let y = kingY - 1; y <= kingY + 1; y++) {
				if (x < 0 || x >= 8 || y < 0 || y >= 8) continue;
				if (x == kingX && y == kingY) continue;
				let piece = board[y][x];
				if (piece != null) {
					if (piece.pieceType == PieceType.King && piece.color == opponentColor) {
						return true;
					}
				}
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
