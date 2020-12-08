import {
	AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Inject,
	Input, OnInit, Output, QueryList, ViewChild, ViewChildren
} from '@angular/core';
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
	@Output() public playerMoveEmitter: EventEmitter<Move> = new EventEmitter<Move>();
	@Output() public onlineMoveEmitter: EventEmitter<Move> = new EventEmitter<Move>();

	public flipBoard: boolean = false;
	public legalMoveHighlightedSquares: Coordinate[] = [];

	@ViewChild('board') private board: ElementRef<HTMLElement>;
	@ViewChildren('dynamicPiece') private dynamicPieces: QueryList<PieceComponent>;

	private clickToMoveTarget: Piece = null;

	constructor(public boardStateService: BoardStateService) { }

	public ngOnInit(): void {
		if (this.settings != null) {
			this.flipBoard = this.settings.playerColor != PlayerColor.White;
			this.boardStateService.setPlayerColor(this.settings.playerColor);
		}
	}

	public ngAfterViewInit(): void {
		this.updateBoardDimensions();
		this.configureContextMenu();
		this.boardStateService.subscribeToPlayerMoves((move: Move) => this.onPlayerMove(move));
		this.boardStateService.subscribeToOnlineMoves((move: Move) => this.onOnlineMove(move));
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
		let displayX = this.flipBoard ? 7 - x : x;
		let displayY = this.flipBoard ? 7 - y : y;

		return this.legalMoveHighlightedSquares.some(position => position.x == displayX && position.y == displayY);
	}

	public onPieceSelected(piece: Piece): void {
		this.showLegalMoves(piece);
	}

	public onPieceClicked(piece: Piece): void {
		if (this.clickToMoveTarget == null) {
			this.clickToMoveTarget = piece;
			return;
		}

		if (piece.color != this.clickToMoveTarget.color) {
			this.boardStateService.notifyMove(this.clickToMoveTarget.x, this.clickToMoveTarget.y, piece.x, piece.y);
			this.clickToMoveTarget = null;
		} else {
			this.toggleLegalMoveVisibility(piece);
		}
	}

	public onPieceDragged(piece: Piece): void {
		this.hideLegalMoves();
	}

	public onTileClicked(x: number, y: number): void {
		if (this.clickToMoveTarget == null) return;

		let endX = this.flipBoard ? 7 - x : x;
		let endY = this.flipBoard ? 7 - y : y;

		this.boardStateService.notifyMove(this.clickToMoveTarget.x, this.clickToMoveTarget.y, endX, endY);
		this.toggleLegalMoveVisibility(this.clickToMoveTarget);
	}

	// Fired when viewport is resized
	@HostListener('window:resize', ['$event'])
	public onResize(event: Event): void {
		this.updateBoardDimensions();
	}

	private toggleLegalMoveVisibility(piece: Piece): void {
		if (piece != this.clickToMoveTarget) {
			this.clickToMoveTarget = piece;
			this.showLegalMoves(piece);
		} else {
			this.clickToMoveTarget = null;
			this.hideLegalMoves();
		}
	}

	private showLegalMoves(piece: Piece): void {
		this.legalMoveHighlightedSquares = [];

		if (this.settings != null && piece.color !== this.settings.playerColor) {
			return;
		}

		let legalMoves = this.boardStateService.getLegalMovesForPiece(piece);
		for (let move of legalMoves) {
			this.legalMoveHighlightedSquares.push({
				x: move.newX,
				y: move.newY
			});
		}
	}

	private hideLegalMoves(): void {
		this.legalMoveHighlightedSquares = [];
		this.clickToMoveTarget = null;
	}

	private onPlayerMove(move: Move): void {
		this.legalMoveHighlightedSquares = [];
		this.playerMoveEmitter.emit(move);
	}

	private onOnlineMove(move: Move): void {
		this.legalMoveHighlightedSquares = [];
		this.onlineMoveEmitter.emit(move);
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
