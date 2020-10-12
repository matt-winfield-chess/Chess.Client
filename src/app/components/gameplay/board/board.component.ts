import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { BoardState } from 'src/app/classes/board-state';
import { Piece } from '../../../classes/piece';
import { FenParserService } from '../../../services/fen-parser.service';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, AfterViewInit {
	public boardState: BoardState;

	@ViewChild('board') private board: ElementRef<HTMLElement>;

	constructor(@Inject(FenParserService) private fenParserService: FenParserService) { }

	public ngOnInit(): void {
		this.boardState = this.fenParserService.parseFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
	}

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
	}

	private configureContextMenu() {
		this.board.nativeElement.oncontextmenu = () => { return false; }
	}
}
