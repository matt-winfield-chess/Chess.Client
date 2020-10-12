import { Injectable } from '@angular/core';
import { FenParseResult } from '../classes/fen-parse-result';
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

	public parseFen(fen: string): FenParseResult {
		let result = new FenParseResult();

		let fenComponents: string[] = fen.split(' ');
		if (fenComponents.length != 6) {
			result.valid = false;
			return result;
		}

		result.pieces = this.parsePieces(fenComponents[0]);

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
