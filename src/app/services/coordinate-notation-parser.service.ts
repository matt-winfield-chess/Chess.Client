import { Injectable } from '@angular/core';
import { Move } from '../classes/move';
import { PieceType } from '../enums/piece-type.enum';

@Injectable({
	providedIn: 'root'
})
export class CoordinateNotationParserService {
	private readonly characterToNumberOffset = 'a'.charCodeAt(0);

	private readonly characterToPieceTypeMap: Map<string, PieceType> = new Map<string, PieceType>([
		['p', PieceType.Pawn],
		['n', PieceType.Knight],
		['b', PieceType.Bishop],
		['r', PieceType.Rook],
		['q', PieceType.Queen],
		['k', PieceType.King]
	]);

	private readonly pieceTypeToCharacterMap: Map<PieceType, string>;

	constructor() {
		let reversedMapArray: [PieceType, string][] = Array.from(this.characterToPieceTypeMap, a => a.reverse()) as [PieceType, string][];
		this.pieceTypeToCharacterMap = new Map(reversedMapArray);
	}

	public toCoordinate(notation: string): [number, number] {
		let lowercaseNotation = notation.toLowerCase().trim();

		if (lowercaseNotation.length != 2) return null;

		let x: number = lowercaseNotation.charCodeAt(0) - this.characterToNumberOffset;
		let y: number = 8 - parseInt(lowercaseNotation.charAt(1));

		return [x, y];
	}

	public toMove(notation: string): Move {
		let lowercaseNotation = notation.toLowerCase().trim();

		if (lowercaseNotation.length < 4 || lowercaseNotation.length > 5) return null;

		return <Move>{
			oldX: this.toCoordinate(lowercaseNotation.substring(0, 2))[0],
			oldY: this.toCoordinate(lowercaseNotation.substring(0, 2))[1],
			newX: this.toCoordinate(lowercaseNotation.substring(2, 4))[0],
			newY: this.toCoordinate(lowercaseNotation.substring(2, 4))[1],
			promotion: lowercaseNotation.length == 5
				? this.characterToPieceTypeMap.get(lowercaseNotation[4])
				: null
		};
	}

	public convertCoordinateToNotation(coordinate: [number, number]): string {
		return `${String.fromCharCode(coordinate[0] + this.characterToNumberOffset)}${8 - coordinate[1]}`;
	}

	public convertMoveToNotation(move: Move): string {
		var promotionString = move.promotion == null
			? ''
			: this.pieceTypeToCharacterMap.get(move.promotion);

		return `${this.convertCoordinateToNotation([move.oldX, move.oldY])}${this.convertCoordinateToNotation([move.newX, move.newY])}${promotionString}`;
	}
}
