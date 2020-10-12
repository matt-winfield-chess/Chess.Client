import { Injectable } from '@angular/core';
import { CastlingState } from '../classes/castling-state';
import { BoardState } from '../classes/board-state';
import { Piece } from '../classes/piece';
import { PieceType } from '../enums/piece-type.enum';
import { PlayerColor } from '../enums/player-color.enum';

@Injectable({
	providedIn: 'root'
})
export class FenParserService {
	private pieceTypeCharacterMap: Map<string, PieceType> = new Map<string, PieceType>([
		["p", PieceType.Pawn],
		["n", PieceType.Knight],
		["b", PieceType.Bishop],
		["r", PieceType.Rook],
		["q", PieceType.Queen],
		["k", PieceType.King]
	]);

	public parseFen(fen: string): BoardState {
		let result = new BoardState();

		let fenComponents: string[] = fen.split(' ');
		if (fenComponents.length != 6) {
			result.valid = false;
			return result;
		}
		result.valid = true;

		result.pieces = this.parsePieces(fenComponents[0]);
		result.activeColor = this.parseActiveColor(fenComponents[1]);
		result.castlingState = this.parseCastlingState(fenComponents[2]);
		// TODO: parse en-passant
		result.halfmoveClock = this.parseNumberComponent(fenComponents[4]);
		result.fullmoveNumber = this.parseNumberComponent(fenComponents[5])

		return result;
	}

	private parsePieces(position: string): Piece[] {
		let pieces: Piece[] = [];

		let x = 0;
		let y = 0;

		for (let i: number = 0; i < position.length; i++) {
			let character = position[i];
			if (this.isNumber(character)) {
				x += parseInt(character);
			} else if (character == '/') {
				y += 1;
				x = 0;
			} else {
				pieces.push(this.getPieceFromCharacter(character, y, x));
				x += 1;
			}
		}
		return pieces;
	}

	private parseActiveColor(activeColorString: string): PlayerColor {
		return activeColorString == "w" ? PlayerColor.White : PlayerColor.Black;
	}

	private parseCastlingState(castleStateString: string): CastlingState {
		let result = new CastlingState();

		result.blackKingside = castleStateString.includes('k');
		result.blackQueenside = castleStateString.includes('q');
		result.whiteKingside = castleStateString.includes('K');
		result.whiteQueenside = castleStateString.includes('Q');

		return result;
	}

	private parseNumberComponent(componentValue: string): number {
		return parseInt(componentValue);
	}

	private getPieceFromCharacter(character: string, rank: number, file: number): Piece {
		let piece = new Piece();

		piece.color = this.isUpperCase(character) ? PlayerColor.White : PlayerColor.Black;
		piece.x = file;
		piece.y = rank;
		piece.pieceType = this.pieceTypeCharacterMap.get(character.toLowerCase());

		return piece;
	}

	private isUpperCase(value: string) {
		return value == value.toUpperCase();
	}

	private isNumber(value: string): boolean {
		return !isNaN(parseInt(value));
	}
}
