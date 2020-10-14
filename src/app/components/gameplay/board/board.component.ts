import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BoardState } from 'src/app/classes/board-state';
import { FenParserService } from '../../../services/fen-parser.service';
import { PieceComponent } from '../piece/piece.component';
import { BoardStateService } from '../../../services/board-state.service'

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent implements AfterViewInit {
	public flipBoard: boolean = false;

	@ViewChild('board') private board: ElementRef<HTMLElement>;
	@ViewChildren('dynamicPiece') private dynamicPieces: QueryList<PieceComponent>;

	constructor(@Inject(BoardStateService) public boardStateService: BoardStateService,
		@Inject(FenParserService) private fenParserService: FenParserService) { }

	public ngAfterViewInit(): void {
		this.updateBoardDimensions();
		this.configureContextMenu();
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

	// Fired when viewport is resized
	@HostListener('window:resize', ['$event'])
	public onResize(event: Event): void {
		this.updateBoardDimensions();
	}

	private updateBoardDimensions() {
		this.board.nativeElement.style.height = getComputedStyle(this.board.nativeElement).width;
		this.notifyPiecesOfBoardSizeChange();
	}

	private notifyPiecesOfBoardSizeChange() {
		this.dynamicPieces.forEach(piece => piece.onBoardSizeChange())
	}

	private configureContextMenu() {
		this.board.nativeElement.oncontextmenu = () => { return false; }
	}
}
