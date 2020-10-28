import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { Piece } from 'src/app/classes/piece';
import { PieceType } from 'src/app/enums/piece-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { MovementStrategyFactoryService } from '../../../services/factories/movement-strategy-factory.service';

@Component({
	selector: 'app-piece',
	templateUrl: './piece.component.html',
	styleUrls: ['./piece.component.scss']
})
export class PieceComponent implements AfterViewInit {
	@Input() piece: Piece;
	@Input() flipBoard: boolean;
	@Input() board: HTMLElement;

	@Output() onPieceSelected = new EventEmitter<Piece>();
	@Output() pieceClicked = new EventEmitter<Piece>();
	@Output() pieceDragged = new EventEmitter<Piece>();

	@ViewChild('piece') pieceElement: ElementRef<HTMLElement>;

	public isDragging: boolean = false;
	private draggingXPosition: number = 0;
	private draggingYPosition: number = 0;
	private boundingRect: DOMRect;
	private boardBoundingRect: DOMRect;

	private colorClassMap: Map<PlayerColor, string> = new Map<PlayerColor, string>([
		[PlayerColor.White, 'white'],
		[PlayerColor.Black, 'black']
	]);

	private pieceTypeClassMap: Map<PieceType, string> = new Map<PieceType, string>([
		[PieceType.Pawn, 'pawn'],
		[PieceType.King, 'king'],
		[PieceType.Queen, 'queen'],
		[PieceType.Rook, 'rook'],
		[PieceType.Bishop, 'bishop'],
		[PieceType.Knight, 'knight']
	]);

	constructor(@Inject(BoardStateService) private boardStateService: BoardStateService,
		@Inject(MovementStrategyFactoryService) private movementStrategyFactory: MovementStrategyFactoryService) { }

	public ngAfterViewInit(): void {
		this.updateDimensions();
		this.configureContextMenu();
		this.piece.movementStrategies = this.movementStrategyFactory.createStrategies(this.piece.pieceType);
	}

	public onBoardSizeChange(): void {
		this.updateDimensions();
	}

	public setFlipBoard(flipBoard: boolean): void {
		this.flipBoard = flipBoard;
	}

	public getPieceTransform(): string {
		let displayPosition = this.convertDisplayPosition(this.piece.x, this.piece.y);

		if (this.isDragging) {
			return this.getDraggingTransform();
		}
		return `translate(${displayPosition[0] * 100}%, ${displayPosition[1] * 100}%)`;
	}

	public getColorClass(): string {
		return this.colorClassMap.get(this.piece.color) ?? '';
	}

	public getPieceTypeClass(): string {
		return this.pieceTypeClassMap.get(this.piece.pieceType) ?? '';
	}

	public onPieceMouseDown(event: MouseEvent): void {
		this.draggingXPosition = event.clientX;
		this.draggingYPosition = event.clientY;

		this.isDragging = true;
		this.onPieceSelected.emit(this.piece);

		document.onmouseup = (evt) => this.stopDragging(evt);
		document.onmousemove = (evt) => this.dragPiece(evt);
	}

	public onPieceTouchStart(event: TouchEvent): void {
		let touch = event.touches[0];

		this.draggingXPosition = touch.clientX;
		this.draggingYPosition = touch.clientY;

		this.isDragging = true;
		this.onPieceSelected.emit(this.piece);

		document.ontouchend = (evt) => this.stopDragging(evt.changedTouches[0]);
		document.ontouchmove = (evt) => this.dragPiece(evt.changedTouches[0]);
	}

	private stopDragging(event: MouseEvent | Touch): void {
		this.isDragging = false;

		this.placePiece(event);

		document.onmousemove = null;
		document.onmouseup = null;
		document.ontouchend = null;
		document.ontouchmove = null;
	}

	private dragPiece(event: MouseEvent | Touch): void {
		this.draggingXPosition = event.clientX;
		this.draggingYPosition = event.clientY;
	}

	private placePiece(event: MouseEvent | Touch): void {
		let newXPosition = event.clientX - this.boardBoundingRect.left;
		let newYPosition = event.clientY - this.boardBoundingRect.top;

		let newXCoord = Math.round((newXPosition / this.boundingRect.width) - 0.5);
		let newYCoord = Math.round((newYPosition / this.boundingRect.height) - 0.5);

		let realNewPosition = this.convertDisplayPosition(newXCoord, newYCoord);

		if (this.hasMoved(realNewPosition[0], realNewPosition[1])) {
			this.pieceDragged.emit(this.piece);
		} else {
			this.pieceClicked.emit(this.piece);
		}

		if (this.isValidCoordinate(newXCoord, newYCoord)) {
			this.boardStateService.notifyMove(this.piece.x, this.piece.y, realNewPosition[0], realNewPosition[1]);
		}
	}

	// Converts to/from display and real position
	private convertDisplayPosition(x: number, y: number): [number, number] {
		if (this.flipBoard) {
			return [7 - x, 7 - y];
		}
		return [x, y];
	}

	private isValidCoordinate(x: number, y: number): boolean {
		return x >= 0 && y >= 0
			&& x < 8 && y < 8;
	}

	private updateDimensions(): void {
		this.boundingRect = this.pieceElement.nativeElement.getBoundingClientRect();
		this.boardBoundingRect = this.board.getBoundingClientRect();
	}

	private configureContextMenu(): void {
		this.pieceElement.nativeElement.oncontextmenu = () => false;
	}

	private getDraggingTransform(): string {
		let xPosition = this.draggingXPosition - this.boardBoundingRect.left;
		let yPosition = this.draggingYPosition - this.boardBoundingRect.top;

		return `translate(calc(${xPosition}px - 50%), calc(${yPosition}px - 50%))`;
	}

	private hasMoved(newX: number, newY: number): boolean {
		return this.piece.x != newX || this.piece.y != newY;
	}
}
