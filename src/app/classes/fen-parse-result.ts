import { PlayerColor } from '../enums/player-color.enum';
import { Piece } from './piece';

export class FenParseResult {
	public valid: boolean;
	public pieces: Piece[];
	public activeColor: PlayerColor;
	public whiteCanKingsideCastle: boolean;
	public whiteCanQueensideCastle: boolean;
	public blackCanKingsideCastle: boolean;
	public blackCanQueensideCastle: boolean;
	public enPassantTargetSquare: string;
	public halfmoveClock: number;
	public fullmoveNumber: number;
}
