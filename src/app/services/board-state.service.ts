import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BoardState } from '../classes/board-state';
import { GameResult } from '../classes/game-result';
import { Move } from '../classes/move';
import { MoveValidationResult } from '../classes/move-validation-result';
import { Piece } from '../classes/piece';
import { PieceType } from '../enums/piece-type.enum';
import { PlayerColor } from '../enums/player-color.enum';
import { MovementStrategyFactoryService } from './factories/movement-strategy-factory.service';
import { FenParserService } from './fen-parser.service';
import { BoardUtils } from '../classes/board-utils';

@Injectable({
	providedIn: 'root'
})
export class BoardStateService {

	private positionsSinceLastIrreversableMove: string[] = [];
	private boardState: BoardState;
	private piecePositions: Piece[][]; // stores piece at it's current position for more efficient retrieval by x/y coordinate
	private playerColor: PlayerColor = null;
	private movementStrategyFactory: MovementStrategyFactoryService;
	private lastMove: Move = null;

	private nonPlayerMoveSubscribers: ((move: Move) => void)[] = [];
	private playerMoveSubscribers: ((move: Move) => void)[] = [];
	private gameEndSubscribers: ((gameResult: GameResult) => void)[] = [];

	constructor(private fenParserService: FenParserService, private router: Router) {
		this.movementStrategyFactory = new MovementStrategyFactoryService(this);

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

	public loadFromMoves(moves: Move[]): void {
		this.setBoardToStandardStartingPosition();

		for (let move of moves) {
			this.forceMove(move);
		}
	}

	public initialiseBoardState(boardState: BoardState): void {
		this.boardState = boardState;
		this.lastMove = null;
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

	public getPiecePositions(): Piece[][] {
		return this.piecePositions;
	}

	public subscribeToNonPlayerMoves(onMove: (move: Move) => void): Subscription {
		this.nonPlayerMoveSubscribers.push(onMove);

		return new Subscription(() => {
			let callbackIndex = this.playerMoveSubscribers.indexOf(onMove);
			if (callbackIndex > -1) {
				this.playerMoveSubscribers.splice(callbackIndex, 1);
			}
		});
	}

	public subscribeToPlayerMoves(onMove: (move: Move) => void): Subscription {
		this.playerMoveSubscribers.push(onMove);

		return new Subscription(() => {
			let callbackIndex = this.playerMoveSubscribers.indexOf(onMove);
			if (callbackIndex > -1) {
				this.playerMoveSubscribers.splice(callbackIndex, 1);
			}
		});
	}

	public subscribeToGameEnd(onGameEnd: (gameResult: GameResult) => void): void {
		this.gameEndSubscribers.push(onGameEnd);
	}

	public notifyMove(move: Move): void {
		let piece = this.piecePositions[move.oldY][move.oldX];

		if (piece) {
			let movementValidationResult = this.validateMove(piece, move.newX, move.newY);
			if (!movementValidationResult.isValid) return;

			movementValidationResult.move = move;

			this.applyMoveAndSideEffects(piece, movementValidationResult);

			this.notifyPlayerMoveSubscribersOfMove(movementValidationResult.move);
			this.validateCheckmate();
			this.validateStalemate();
			this.validateThreefoldRepetition();
		}
	}

	public applyNonPlayerMove(move: Move, notify: boolean = true): void {
		let piece = this.piecePositions[move.oldY][move.oldX];

		if (piece) {
			let movementValidationResult = this.validateMove(piece, move.newX, move.newY, true);
			movementValidationResult.move = move;

			this.applyMoveAndSideEffects(piece, movementValidationResult);

			if (notify) {
				this.notifyOpponentMoveSubscribersOfMove(movementValidationResult.move);
			}

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
					legalMoves.push(<Move>{
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
						legalMoves.push(<Move>{
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
		let isKingPredicate = (piece: Piece) => piece?.pieceType == PieceType.King && piece?.color == kingColor;

		let kingY = board.findIndex(rank => rank.some(isKingPredicate));
		if (kingY === undefined) return false;

		let kingX = board[kingY].findIndex(isKingPredicate);
		if (kingX === undefined) return false;

		return BoardUtils.isSquareAttacked(kingX, kingY, kingColor, board);
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

	public getLastMove(): Move {
		return this.lastMove;
	}

	private forceMove(move: Move): void {
		let piece = this.piecePositions[move.oldY][move.oldX];

		if (piece) {
			let moveValidationResult = new MoveValidationResult()
			moveValidationResult.isValid = true;
			moveValidationResult.move = move;
			moveValidationResult.castleRookMove = this.getCastleRookMove(move, piece);
			moveValidationResult.isCastleMove = moveValidationResult.castleRookMove !== null;
			moveValidationResult.isEnPassantCapture = this.isEnPassantCapture(move, piece);
			moveValidationResult.isPromotion = this.isPromotion(move, piece);

			this.applyMoveAndSideEffects(piece, moveValidationResult);
		}
	}

	private getCastleRookMove(move: Move, piece: Piece): Move {
		if (piece.pieceType != PieceType.King) return null;
		if (piece.color === PlayerColor.White) {
			if (move.newX == 2 && this.boardState.castlingState.whiteQueenside) {
				return <Move>{
					oldX: 0,
					oldY: move.oldY,
					newX: 3,
					newY: move.oldY
				};
			} else if (move.newX == 6 && this.boardState.castlingState.whiteKingside) {
				return <Move>{
					oldX: 7,
					oldY: move.oldY,
					newX: 5,
					newY: move.oldY
				};
			}
		} else {
			if (move.newX == 2 && this.boardState.castlingState.blackQueenside) {
				return <Move>{
					oldX: 0,
					oldY: move.oldY,
					newX: 3,
					newY: move.oldY
				};
			} else if (move.newX == 6 && this.boardState.castlingState.blackKingside) {
				return <Move>{
					oldX: 7,
					oldY: move.oldY,
					newX: 5,
					newY: move.oldY
				};
			}
		}
		return null;
	}

	private isEnPassantCapture(move: Move, piece: Piece): boolean {
		if (piece.pieceType !== PieceType.Pawn) return false;
		let targetSquarePiece = this.piecePositions[move.newY][move.newX];
		return targetSquarePiece === null && move.oldX !== move.newX;
	}

	private isPromotion(move: Move, piece: Piece): boolean {
		if (piece.pieceType !== PieceType.Pawn) return false;
		return move.newY === 0 || move.newY == 7;
	}

	private validateMove(piece: Piece, newX: number, newY: number, ignoreColor: boolean = false): MoveValidationResult {
		if (piece.x == newX && piece.y == newY) return new MoveValidationResult({ isValid: false });
		if (piece.color != this.boardState.activeColor && !ignoreColor) return new MoveValidationResult({ isValid: false });
		if (this.playerColor !== null && piece.color != this.playerColor && !ignoreColor) return new MoveValidationResult({ isValid: false });

		let movementStrategies = this.movementStrategyFactory.createStrategies(piece.pieceType);

		for (let movementStrategy of movementStrategies) {
			let movementValidationResult = movementStrategy.isValidMove(<Move>{
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
		this.lastMove = movementValidationResult.move;

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
		this.addPiece(move.newX, move.newY, move.promotion, pawn.color);
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
		for (let moveSubscriber of this.nonPlayerMoveSubscribers) {
			moveSubscriber(move);
		}
	}

	private notifyPlayerMoveSubscribersOfMove(move: Move): void {
		for (let moveSubscriber of this.playerMoveSubscribers) {
			moveSubscriber(move);
		}
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
