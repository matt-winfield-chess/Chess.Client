import { Inject, Injectable } from '@angular/core';
import { BoardState } from '../classes/board-state';
import { Piece } from '../classes/piece';
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
		}
	}

	private isLegalMove(piece: Piece, newX: number, newY: number) {
		if (piece.x == newX && piece.y == newY) return false;

		for (let movementStrategy of piece.movementStrategies) {
			if (movementStrategy.isValidMove(piece.x, piece.y, newX, newY, piece.color)) {
				return true;
			}
		}
		return false;
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
