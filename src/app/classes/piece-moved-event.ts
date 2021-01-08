import { Piece } from "./piece";

export class PieceMovedEvent {
	public piece: Piece;
	public oldX: number;
	public oldY: number;
	public newX: number;
	public newY: number;
}
