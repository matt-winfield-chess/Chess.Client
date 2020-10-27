import { Injectable } from '@angular/core';
import { Move } from '../classes/move';

@Injectable({
	providedIn: 'root'
})
export class CoordinateNotationParserService {
	private readonly characterToNumberOffset = 'a'.charCodeAt(0);

	public toCoordinate(notation: string): [number, number] {
		let lowercaseNotation = notation.toLowerCase().trim();

		if (lowercaseNotation.length != 2) return null;

		let x: number = lowercaseNotation.charCodeAt(0) - this.characterToNumberOffset;
		let y: number = 8 - parseInt(lowercaseNotation.charAt(1));

		return [x, y];
	}

	public toMove(notation: string): Move {
		let lowercaseNotation = notation.toLowerCase().trim();

		if (lowercaseNotation.length != 4) return null;

		return {
			oldX: this.toCoordinate(lowercaseNotation.substring(0, 2))[0],
			oldY: this.toCoordinate(lowercaseNotation.substring(0, 2))[1],
			newX: this.toCoordinate(lowercaseNotation.substring(2))[0],
			newY: this.toCoordinate(lowercaseNotation.substring(2))[1]
		};
	}

	public convertCoordinateToNotation(coordinate: [number, number]): string {
		return `${String.fromCharCode(coordinate[0] + this.characterToNumberOffset)}${8 - coordinate[1]}`;
	}

	public convertMoveToNotation(move: Move): string {
		return `${this.convertCoordinateToNotation([move.oldX, move.oldY])}${this.convertCoordinateToNotation([move.newX, move.newY])}`;
	}
}
