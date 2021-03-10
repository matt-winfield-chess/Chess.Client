import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, IterableDiffer, IterableDiffers, Output, QueryList, ViewChildren } from '@angular/core';
import { Move } from 'src/app/classes/move';
import { BoardStateService } from 'src/app/services/board-state.service';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';

@Component({
	selector: 'app-move-history',
	templateUrl: './move-history.component.html',
	styleUrls: ['./move-history.component.scss']
})
export class MoveHistoryComponent implements AfterViewChecked {
	@Input() public moves: Move[];
	@Output() public isInPastChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChildren('moveElements') public moveElements: QueryList<ElementRef<HTMLElement>>;

	public activeMoveNumber: number = 0;
	public isWhiteActive: boolean = false;

	constructor(private boardStateService: BoardStateService, private coordinateNotationParserService: CoordinateNotationParserService, private elementRef: ElementRef<HTMLElement>) {
		this.boardStateService.subscribeToPlayerMoves(() => this.onMove());
		this.boardStateService.subscribeToNonPlayerMoves(() => this.onMove());
	}

	public ngAfterViewChecked(): void {
		let lastMove = this.moveElements?.last?.nativeElement;
		let scrollOffset = lastMove?.offsetTop;
		if (lastMove && scrollOffset > this.elementRef.nativeElement.offsetHeight && scrollOffset != this.elementRef.nativeElement.scrollTop) {
			this.elementRef.nativeElement.scrollTop = scrollOffset;
		}
	}

	public getFormattedMoves(): FormattedMove[] {
		if (this.moves == null) return [];

		let moves: FormattedMove[] = [];

		for (let i = 0; i < this.moves.length; i += 2) {
			let formattedMove = new FormattedMove();
			formattedMove.moveNumber = Math.floor(i / 2) + 1;
			formattedMove.whiteMove = this.formatMove(this.moves[i]);

			if (i + 1 < this.moves.length) {
				formattedMove.blackMove = this.formatMove(this.moves[i + 1]);
			} else {
				formattedMove.blackMove = null;
			}
			moves.push(formattedMove);
		}
		return moves;
	}

	public formatMove(move: Move): string {
		return this.coordinateNotationParserService.convertMoveToNotation(move);
	}

	public isMoveActive(moveNumber: number, isBlack: boolean): boolean {
		return moveNumber === this.activeMoveNumber && isBlack !== this.isWhiteActive;
	}

	public onMoveClicked(moveNumber: number, isBlack: boolean): void {
		this.activeMoveNumber = moveNumber;
		this.isWhiteActive = !isBlack;

		let moveIndex = (moveNumber - 1) * 2;
		if (isBlack) {
			moveIndex += 1;
		}

		this.boardStateService.loadFromMoves(this.moves.slice(0, moveIndex + 1));

		this.isInPast();
	}

	public setActiveMove(moveNumber: number, isWhiteActive: boolean): void {
		this.activeMoveNumber = moveNumber;
		this.isWhiteActive = isWhiteActive;
	}

	private onMove(): void {
		this.activeMoveNumber += this.isWhiteActive ? 0 : 1;
		this.isWhiteActive = !this.isWhiteActive;
	}

	private isInPast(): void {
		this.isInPastChanged.emit(this.activeMoveNumber !== Math.ceil(this.moves.length / 2) || this.isWhiteActive == (this.moves.length % 2 == 0))
	}
}

class FormattedMove {
	moveNumber: number;
	whiteMove: string;
	blackMove: string;
}
