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

	public getPieceTransform(): string {
		return `translate(${this.xCoord * 100}%, ${this.yCoord * 100}%)`;
	}

	public getColorClass(): string {
		return this.colorClassMap.get(this.color);
	}

	public getPieceTypeClass(): string {
		return this.pieceTypeClassMap.get(this.pieceType);
	}

	private configureContextMenu() {
		this.piece.nativeElement.oncontextmenu = () => { return false; }
	}
}
