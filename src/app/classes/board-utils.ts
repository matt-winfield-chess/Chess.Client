import { PieceType } from "../enums/piece-type.enum";
import { PlayerColor } from "../enums/player-color.enum";
import { Piece } from "./piece";

export class BoardUtils {
	public static isSquareAttacked(x: number, y: number, color: PlayerColor, board: Piece[][]): boolean {
		let opponentColor: PlayerColor = color == PlayerColor.White ? PlayerColor.Black : PlayerColor.White;

		return this.isSquareAttackedInStraightLine(x, y, opponentColor, board) ||
			this.isSquareAttackedDiagonally(x, y, opponentColor, board) ||
			this.isSquareAttackedByPawn(x, y, opponentColor, board) ||
			this.isSquareAttackedByKnight(x, y, opponentColor, board) ||
			this.isSquareAttackedByKing(x, y, opponentColor, board);
	}

	private static isSquareAttackedInStraightLine(x: number, y: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		let validPieces = [PieceType.Queen, PieceType.Rook];
		if (this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, 1, 0, validPieces)) return true;
		if (this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, -1, 0, validPieces)) return true;
		if (this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, 0, 1, validPieces)) return true;
		return this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, 0, -1, validPieces);
	}

	private static isSquareAttackedDiagonally(x: number, y: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		let validPieces = [PieceType.Queen, PieceType.Bishop];

		if (this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, 1, 1, validPieces)) return true;
		if (this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, 1, -1, validPieces)) return true;
		if (this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, -1, 1, validPieces)) return true;
		return this.isSquareAttackedByLineOfSightPiece(x, y, opponentColor, board, -1, -1, validPieces);
	}

	private static isSquareAttackedByLineOfSightPiece(x: number, y: number, opponentColor: PlayerColor, board: Piece[][],
		xIncrement: number, yIncrement: number, validPieces: PieceType[]): boolean {
		x += xIncrement;
		y += yIncrement;

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

	private static isSquareAttackedByPawn(x: number, y: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		let opponentMovementDirection = opponentColor == PlayerColor.White ? -1 : 1;

		if (y - opponentMovementDirection < 0) return false;

		if (x - 1 >= 0) {
			let candidateAttacker1 = board[y - opponentMovementDirection][x - 1];
			if (candidateAttacker1 != null && candidateAttacker1.pieceType == PieceType.Pawn && candidateAttacker1.color == opponentColor) {
				return true;
			}
		}

		if (x + 1 < 8) {
			let candidateAttacker2 = board[y - opponentMovementDirection][x + 1];
			if (candidateAttacker2 != null && candidateAttacker2.pieceType == PieceType.Pawn && candidateAttacker2.color == opponentColor) {
				return true;
			}
		}

		return false;
	}

	private static isSquareAttackedByKnight(x: number, y: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		if (this.doesSquareHaveOpponentKnight(x + 2, y + 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(x + 2, y - 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(x - 2, y + 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(x - 2, y - 1, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(x + 1, y + 2, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(x + 1, y - 2, opponentColor, board)) return true;
		if (this.doesSquareHaveOpponentKnight(x - 1, y + 2, opponentColor, board)) return true;
		return this.doesSquareHaveOpponentKnight(x - 1, y - 2, opponentColor, board);
	}

	private static doesSquareHaveOpponentKnight(x: number, y: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		if (x < 0 || x >= 8 || y < 0 || y >= 8) return false;
		let piece = board[y][x];
		if (piece == null) return false;
		return piece.pieceType == PieceType.Knight && piece.color == opponentColor;
	}

	private static isSquareAttackedByKing(squareX: number, squareY: number, opponentColor: PlayerColor, board: Piece[][]): boolean {
		for (let x = squareX - 1; x <= squareX + 1; x++) {
			for (let y = squareY - 1; y <= squareY + 1; y++) {
				if (x < 0 || x >= 8 || y < 0 || y >= 8) continue;
				if (x == squareX && y == squareY) continue;
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
}
