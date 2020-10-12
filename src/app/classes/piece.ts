import { PieceType } from '../enums/piece-type.enum';
import { PlayerColor } from '../enums/player-color.enum';

export class Piece {
	public x: number;
	public y: number;
	public pieceType: PieceType;
	public color: PlayerColor;
}
