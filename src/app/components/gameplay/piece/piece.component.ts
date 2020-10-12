import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PieceType } from 'src/app/enums/piece-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';

@Component({
	selector: 'app-piece',
	templateUrl: './piece.component.html',
	styleUrls: ['./piece.component.scss']
})
export class PieceComponent implements AfterViewInit {
	@Input() xCoord: number;
	@Input() yCoord: number;
	@Input() color: PlayerColor;
	@Input() pieceType: PieceType;
	@Input() flipBoard: boolean;

	@ViewChild('piece') piece: ElementRef<HTMLElement>;

	private colorClassMap: Map<PlayerColor, string> = new Map<PlayerColor, string>([
		[PlayerColor.White, "white"],
		[PlayerColor.Black, "black"]
	])

	private pieceTypeClassMap: Map<PieceType, string> = new Map<PieceType, string>([
		[PieceType.Pawn, "pawn"],
		[PieceType.King, "king"],
		[PieceType.Queen, "queen"],
		[PieceType.Rook, "rook"],
		[PieceType.Bishop, "bishop"],
		[PieceType.Knight, "knight"]
	])

	public ngAfterViewInit(): void {
		this.configureContextMenu();
	}

	public setFlipBoard(flipBoard: boolean) {
		this.flipBoard = flipBoard;
	}

	public getPieceTransform(): string {
		let displayX = this.xCoord;
		let displayY = this.yCoord;

		if (this.flipBoard) {
			displayX = 7 - displayX;
			displayY = 7 - displayY;
		}

		return `translate(${displayX * 100}%, ${displayY * 100}%)`;
	}

	public getColorClass(): string {
		return this.colorClassMap.get(this.color) ?? '';
	}

	public getPieceTypeClass(): string {
		return this.pieceTypeClassMap.get(this.pieceType) ?? '';
	}

	private configureContextMenu() {
		this.piece.nativeElement.oncontextmenu = () => { return false; }
	}
}
