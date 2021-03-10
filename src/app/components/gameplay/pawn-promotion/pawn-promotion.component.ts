import { Component, EventEmitter, Output } from '@angular/core';
import { Piece } from 'src/app/classes/piece';
import { PieceType } from 'src/app/enums/piece-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';

@Component({
	selector: 'app-pawn-promotion',
	templateUrl: './pawn-promotion.component.html',
	styleUrls: ['./pawn-promotion.component.scss']
})
export class PawnPromotionComponent {

	@Output() public pieceSelected: EventEmitter<PieceType> = new EventEmitter<PieceType>();

	public queenPiece: Piece = {
		color: PlayerColor.White,
		pieceType: PieceType.Queen,
		x: 0,
		y: 0
	}

	public knightPiece: Piece = {
		color: PlayerColor.White,
		pieceType: PieceType.Knight,
		x: 0,
		y: 0
	}

	public rookPiece: Piece = {
		color: PlayerColor.White,
		pieceType: PieceType.Rook,
		x: 0,
		y: 0
	}

	public bishopPiece: Piece = {
		color: PlayerColor.White,
		pieceType: PieceType.Bishop,
		x: 0,
		y: 0
	}

	constructor() { }

	public onPieceClicked(piece: Piece) {
		this.pieceSelected.emit(piece.pieceType);
	}
}
