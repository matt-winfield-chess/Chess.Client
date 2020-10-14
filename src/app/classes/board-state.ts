import { PlayerColor } from '../enums/player-color.enum';
import { Piece } from './piece';
import { CastlingState } from './castling-state';

export class BoardState {
	public valid: boolean;
	public pieces: Piece[];
	public activeColor: PlayerColor = PlayerColor.White;
	public castlingState: CastlingState = new CastlingState();
	public enPassantTargetSquare: [number, number];
	public halfmoveClock: number = 1;
	public fullmoveNumber: number = 1;
}
