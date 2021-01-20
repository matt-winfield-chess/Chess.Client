import { PieceType } from "../enums/piece-type.enum";

export class Move {
	public oldX: number;
	public oldY: number;
	public newX: number;
	public newY: number;
	public promotion?: PieceType;
}
