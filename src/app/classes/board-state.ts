import { PlayerColor } from '../enums/player-color.enum';
import { Piece } from './piece';
import { CastlingState } from './castling-state';

export class BoardState {
	public valid: boolean;
	public pieces: Piece[];
	public activeColor: PlayerColor;
	public castlingState: CastlingState;
	public enPassantTargetSquare: string;
	public halfmoveClock: number;
	public fullmoveNumber: number;
}
