import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EAGAIN } from 'constants';
import { BoardState } from '../classes/board-state';
import { GameResult } from '../classes/game-result';
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

	private positionsSinceLastIrreversableMove: string[] = [];
	private boardState: BoardState;
	private piecePositions: Piece[][]; // stores piece at it's current position for more efficient retrieval by x/y coordinate
	private playerColor: PlayerColor = null;

	private onlineMoveSubscribers: ((move: Move) => void)[] = [];
	private playerMoveSubscribers: ((move: Move) => void)[] = [];
	private gameEndSubscribers: ((gameResult: GameResult) => void)[] = [];

	constructor(@Inject(FenParserService) private fenParserService: FenParserService, @Inject(Router) private router: Router) {
		this.setBoardToStandardStartingPosition();
		this.router.events.subscribe((event) => {
			this.setBoardToStandardStartingPosition();
		});
	}

	public setBoardToStandardStartingPosition(): void {
		this.loadFromFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	}

	public loadFromFen(fen: string): void {
		this.initialiseBoardState(this.fenParserService.parseFen(fen));
	}

	public initialiseBoardState(boardState: BoardState): void {
		this.boardState = boardState;
		this.positionsSinceLastIrreversableMove = [boardState.getFen()];
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

	public subscribeToOnlineMoves(onMove: (move: Move) => void): void {
		this.onlineMoveSubscribers.push(onMove);
	}

	public subscribeToPlayerMoves(onMove: (move: Move) => void): void {
		this.playerMoveSubscribers.push(onMove);
	}

	public subscribeToGameEnd(onGameEnd: (gameResult: GameResult) => void): void {
		this.gameEndSubscribers.push(onGameEnd);
	}

	public notifyMove(oldX: number, oldY: number, newX: number, newY: number): void {
		let piece = this.piecePositions[oldY][oldX];

		if (piece) {
			let movementValidationResult = this.validateMove(piece, newX, newY);
			if (!movementValidationResult.isValid) return;

			this.applyMoveAndSideEffects(piece, movementValidationResult);

			this.notifyPlayerMoveSubscribersOfMove(movementValidationResult.move);
			this.validateCheckmate();
			this.validateStalemate();
			this.validateThreefoldRepetition();
		}
	}

	public applyOnlineOpponentMove(oldX: number, oldY: number, newX: number, newY: number): void {
		let piece = this.piecePositions[oldY][oldX];

		if (piece) {
			let movementValidationResult = this.validateMove(piece, newX, newY, true);

			this.applyMoveAndSideEffects(piece, movementValidationResult);

			this.notifyOpponentMoveSubscribersOfMove(movementValidationResult.move);
			this.validateCheckmate();
			this.validateStalemate();
			this.validateThreefoldRepetition();
		}
	}

	public getLegalMovesForPiece(piece: Piece): Move[] {
		let legalMoves: Move[] = [];
		if (piece.color != this.boardState.activeColor) return legalMoves;

		for (let x: number = 0; x < 8; x++) {
			for (let y: number = 0; y < 8; y++) {
				let validationResult = this.validateMove(piece, x, y, true);
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

	public getAllLegalMoves(color: PlayerColor): Move[] {
		let legalMoves: Move[] = [];

		for (let x: number = 0; x < 8; x++) {
			for (let y: number = 0; y < 8; y++) {
				for (let piece of this.boardState.pieces) {
					if (piece.color != color) {
						continue;
					}

					let validationResult = this.validateMove(piece, x, y, true);
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

	private validateMove(piece: Piece, newX: number, newY: number, ignoreColor: boolean = false): MoveValidationResult {
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
				}
				return movementValidationResult;
			}
		}
		return new MoveValidationResult({ isValid: false });
	}

	private isCheckmate(activeColor: PlayerColor): boolean {
		let legalMoves = this.getAllLegalMoves(activeColor);
		return this.isKingInCheck(activeColor) && legalMoves.length == 0;
	}

	private isStalemate(activeColor: PlayerColor): boolean {
		let legalMoves = this.getAllLegalMoves(activeColor);
		return !this.isKingInCheck(activeColor) && legalMoves.length == 0;
	}

	private isThreefoldRepetition(): boolean {
		console.log('previous positions: ', ...this.positionsSinceLastIrreversableMove);
		console.log('current position: ', this.boardState.getFen());
		let repetitionCount = 0;
		for (let position of this.positionsSinceLastIrreversableMove) {
			if (this.doesCurrentPositionMatchFen(position)) {
				repetitionCount += 1;
			}
		}
		return repetitionCount >= 3;
	}

	private doesCurrentPositionMatchFen(fen: string): boolean {
		let currentFen = this.boardState.getFen().split(' ');
		let splitFen = fen.split(' ');

		return currentFen[0] == splitFen[0]
			&& currentFen[1] == splitFen[1]
			&& currentFen[2] == splitFen[2]
			&& currentFen[3] == splitFen[3];
	}

	private validateCheckmate(): void {
		if (this.isCheckmate(this.boardState.activeColor)) {
			let winner = this.boardState.activeColor == PlayerColor.White ? PlayerColor.Black : PlayerColor.White;
			this.notifyGameEndSubscribers(winner, 'checkmate');
		}
	}

	private validateStalemate(): void {
		if (this.isStalemate(this.boardState.activeColor)) {
			this.notifyGameEndSubscribers(null, 'stalemate');
		}
	}

	private validateThreefoldRepetition(): void {
		if (this.isThreefoldRepetition()) {
			this.notifyGameEndSubscribers(null, 'threefold repetition');
		}
	}

	private notifyGameEndSubscribers(winnerColor: PlayerColor, termination: string): void {
		for (let gameEndSubscriber of this.gameEndSubscribers) {
			gameEndSubscriber({
				winnerColor,
				termination
			});
		}
	}

	private applyMoveAndSideEffects(piece: Piece, movementValidationResult: MoveValidationResult): void {
		this.handleEnPassant(piece, movementValidationResult);

		this.applyMove(movementValidationResult.move);

		if (movementValidationResult.isCastleMove) {
			this.applyMove(movementValidationResult.castleRookMove);
		}

		this.handlePromotion(movementValidationResult);

		this.updateBoardStateCounters(movementValidationResult);
		this.updateCastlingRights(piece, movementValidationResult.move.oldX, movementValidationResult.move.oldY);
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

	private notifyOpponentMoveSubscribersOfMove(move: Move): void {
		for (let moveSubscriber of this.onlineMoveSubscribers) {
			moveSubscriber(move);
		}
	}

	private notifyPlayerMoveSubscribersOfMove(move: Move): void {
		for (let moveSubscriber of this.playerMoveSubscribers) {
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

	private updateBoardStateCounters(moveValidationResult: MoveValidationResult): void {
		if (this.boardState.activeColor == PlayerColor.Black) {
			this.boardState.fullmoveNumber += 1;
		}

		if (moveValidationResult.shouldResetFiftyMoveRuleCounter) {
			this.boardState.halfmoveClock = 0;
		} else {
			this.boardState.halfmoveClock += 1;
		}

		// 50 move rule = 100 half-moves
		if (this.boardState.halfmoveClock >= 100) {
			this.notifyGameEndSubscribers(null, '50 move rule');
		}

		this.boardState.activeColor = this.boardState.activeColor == PlayerColor.White ? PlayerColor.Black : PlayerColor.White;

		if (moveValidationResult.shouldResetFiftyMoveRuleCounter) {
			this.positionsSinceLastIrreversableMove = [];
		}
		this.positionsSinceLastIrreversableMove.push(this.boardState.getFen());
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
