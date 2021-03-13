import { Injectable } from '@angular/core';
import { CastlingState } from '../classes/castling-state';
import { BoardState } from '../classes/board-state';
import { Piece } from '../classes/piece';
import { PieceType } from '../enums/piece-type.enum';
import { PlayerColor } from '../enums/player-color.enum';
import { CoordinateNotationParserService } from './coordinate-notation-parser.service';

@Injectable({
	providedIn: 'root'
})
export class FenParserService {
	private readonly characterToPieceTypeMap: Map<string, PieceType> = new Map<string, PieceType>([
		['p', PieceType.Pawn],
		['n', PieceType.Knight],
		['b', PieceType.Bishop],
		['r', PieceType.Rook],
		['q', PieceType.Queen],
		['k', PieceType.King]
	]);

	private readonly pieceTypeToCharacterMap: Map<PieceType, string>;

	constructor(private coordinateNotationParser: CoordinateNotationParserService) {
		let reversedMapArray: [PieceType, string][] = Array.from(this.characterToPieceTypeMap, a => a.reverse()) as [PieceType, string][];
		this.pieceTypeToCharacterMap = new Map(reversedMapArray);
	}

	public parseFen(fen: string): BoardState {
		let result = new BoardState(this);

		let fenComponents: string[] = fen.split(' ');
		if (fenComponents.length != 6) {
			result.valid = false;
			return result;
		}
		result.valid = true;

		result.pieces = this.parsePieces(fenComponents[0]);
		result.activeColor = this.parseActiveColor(fenComponents[1]);
		result.castlingState = this.parseCastlingState(fenComponents[2]);
		result.enPassantTargetSquare = this.coordinateNotationParser.toCoordinate(fenComponents[3]);
		result.halfmoveClock = this.parseNumberComponent(fenComponents[4]);
		result.fullmoveNumber = this.parseNumberComponent(fenComponents[5]);

		return result;
	}

	public convertBoardStateToFen(state: BoardState): string {
		let pieces = this.getPiecesFen(state.pieces);
		let activeColor = state.activeColor == PlayerColor.White ? 'w' : 'b';
		let castlingState = this.getCastlingStateFen(state.castlingState);
		let enPassantTargetSquare = state.enPassantTargetSquare != null
			? `${this.coordinateNotationParser.convertCoordinateToNotation(state.enPassantTargetSquare)}`
			: '-';

		return `${pieces} ${activeColor} ${castlingState} ${enPassantTargetSquare} ${state.halfmoveClock} ${state.fullmoveNumber}`;
	}

	private parsePieces(position: string): Piece[] {
		let pieces: Piece[] = [];

		let x = 0;
		let y = 0;

		for (let character of position) {
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
		return activeColorString == 'w' ? PlayerColor.White : PlayerColor.Black;
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
		piece.pieceType = this.characterToPieceTypeMap.get(character.toLowerCase());

		return piece;
	}

	private isUpperCase(value: string): boolean {
		return value == value.toUpperCase();
	}

	private isNumber(value: string): boolean {
		return !isNaN(parseInt(value));
	}

	private getPiecesFen(pieces: Piece[]): string {
		let output = '';
		let spaceCount = 0;
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				let piece = this.getPiece(x, y, pieces);
				if (piece == null) {
					spaceCount += 1;
				}
				else {
					if (spaceCount > 0) {
						output += spaceCount.toString();
						spaceCount = 0;
					}

					let character = this.pieceTypeToCharacterMap.get(piece.pieceType);

					if (piece.color == PlayerColor.White) {
						character = character.toUpperCase();
					}

					output += character;
				}
			}

			if (spaceCount > 0) {
				output += spaceCount.toString();
				spaceCount = 0;
			}

			if (y != 0) {
				output += '/';
			}
		}

		return output;
	}

	private getCastlingStateFen(state: CastlingState): string {
		if (!state.whiteKingside && !state.whiteQueenside && !state.blackKingside && !state.blackQueenside) {
			return '-';
		}

		let output = '';
		if (state.whiteKingside) {
			output += 'K';
		}

		if (state.whiteQueenside) {
			output += 'Q';
		}

		if (state.blackKingside) {
			output += 'k';
		}

		if (state.blackQueenside) {
			output += 'q';
		}

		return output;
	}

	private getPiece(x: number, y: number, pieces: Piece[]): Piece {
		return pieces.find(piece => piece.x == x && piece.y == y) ?? null;
	}
}
