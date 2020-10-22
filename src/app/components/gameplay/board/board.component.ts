import { AfterViewInit, Component, ElementRef, HostListener, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PieceComponent } from '../piece/piece.component';
import { BoardStateService } from '../../../services/board-state.service';
import { Piece } from 'src/app/classes/piece';
import { Coordinate } from '../../../classes/coordinate';
import { Move } from 'src/app/classes/move';
import { BoardSettings } from 'src/app/classes/board-settings';
import { PlayerColor } from 'src/app/enums/player-color.enum';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {
	@Input() public settings: BoardSettings;
	public flipBoard: boolean = false;
	public legalMoveHighlightedSquares: Coordinate[] = [];

	@ViewChild('board') private board: ElementRef<HTMLElement>;
	@ViewChildren('dynamicPiece') private dynamicPieces: QueryList<PieceComponent>;

	constructor(@Inject(BoardStateService) public boardStateService: BoardStateService) { }

	public ngOnInit(): void {
		if (this.settings != null) {
			this.flipBoard = this.settings.playerColor != PlayerColor.White;
			this.boardStateService.setPlayerColor(this.settings.playerColor);
		}
	}

	public ngAfterViewInit(): void {
		this.updateBoardDimensions();
		this.configureContextMenu();
		this.boardStateService.subscribeToMoves((move: Move) => this.onMove(move));
	}

	public range(count: number): Array<number> {
		return Array.from(Array(count).keys());
	}

	public getTilePositioning(n: number): string {
		return `${n * 12.5}%`;
	}

	public isDarkSquare(x: number, y: number): boolean {
		return (x + y) % 2 == 1;
	}

	public isHighlighted(x: number, y: number): boolean {
		return this.legalMoveHighlightedSquares.some(position => position.x == x && position.y == y);
	}

	public onPieceSelected(piece: Piece): void {
		this.legalMoveHighlightedSquares = [];

		if (this.settings != null && piece.color !== this.settings.playerColor) {
			return;
		}

		let legalMoves = this.boardStateService.getLegalMoves(piece);
		for (let move of legalMoves) {
			this.legalMoveHighlightedSquares.push({
				x: move.newX,
				y: move.newY
			});
		}
	}

	// Fired when viewport is resized
	@HostListener('window:resize', ['$event'])
	public onResize(event: Event): void {
		this.updateBoardDimensions();
	}

	private onMove(move: Move): void {
		this.legalMoveHighlightedSquares = [];
	}

	private updateBoardDimensions(): void {
		this.board.nativeElement.style.height = getComputedStyle(this.board.nativeElement).width;
		this.notifyPiecesOfBoardSizeChange();
	}

	private notifyPiecesOfBoardSizeChange(): void {
		this.dynamicPieces.forEach(piece => piece.onBoardSizeChange());
	}

	private configureContextMenu(): void {
		this.board.nativeElement.oncontextmenu = () => false;
	}
}
