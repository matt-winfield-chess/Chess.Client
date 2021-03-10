import { PieceType } from '../enums/piece-type.enum';
import { PlayerColor } from '../enums/player-color.enum';
import { MovementStrategy } from './movement-strategies/movement-strategy';

export class Piece {
	public x: number;
	public y: number;
	public pieceType: PieceType;
	public color: PlayerColor;
}
