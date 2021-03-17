import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, IterableDiffer, IterableDiffers, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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

	@ViewChild('moveHistoryContainer') private moveHistoryContainer: ElementRef<HTMLElement>;

	constructor(private boardStateService: BoardStateService, private coordinateNotationParserService: CoordinateNotationParserService) {
		this.boardStateService.subscribeToPlayerMoves(() => this.onMove());
		this.boardStateService.subscribeToNonPlayerMoves(() => this.onMove());
	}

	public ngAfterViewChecked(): void {
		let lastMove = this.moveElements?.last?.nativeElement;
		let scrollOffset = lastMove?.offsetTop;
		if (lastMove && scrollOffset > this.moveHistoryContainer.nativeElement.offsetHeight && scrollOffset != this.moveHistoryContainer.nativeElement.scrollTop) {
			this.moveHistoryContainer.nativeElement.scrollTop = scrollOffset;
		}
	}

	@HostListener('document:keydown', ['$event'])
	public handleKeyboardEvent(event: KeyboardEvent): void {
		if (event.key == 'ArrowLeft') {
			this.stepBack();
		} else if (event.key == 'ArrowRight') {
			this.stepForward();
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
		if (!this.isValidMove(moveNumber, !isBlack)) return;
		this.goToMove(moveNumber, !isBlack);
	}

	public setActiveMove(moveNumber: number, isWhiteActive: boolean): void {
		this.activeMoveNumber = moveNumber;
		this.isWhiteActive = isWhiteActive;
	}

	public stepForward(): void {
		let newMoveNumber = this.activeMoveNumber + (this.isWhiteActive ? 0 : 1);
		let isWhiteActive = !this.isWhiteActive;

		if (!this.isValidMove(newMoveNumber, isWhiteActive)) return;

		this.activeMoveNumber = newMoveNumber
		this.isWhiteActive = isWhiteActive

		this.goToMove(newMoveNumber, isWhiteActive);
	}

	public stepBack(): void {
		let newMoveNumber = this.activeMoveNumber - (this.isWhiteActive ? 1 : 0);
		let isWhiteActive = !this.isWhiteActive;

		if (!this.isValidMove(newMoveNumber, isWhiteActive)) return;

		this.activeMoveNumber = newMoveNumber;
		this.isWhiteActive = isWhiteActive

		this.goToMove(newMoveNumber, isWhiteActive);
	}

	private goToMove(moveNumber: number, isWhiteActive: boolean): void {
		this.activeMoveNumber = moveNumber;
		this.isWhiteActive = isWhiteActive;

		let moveIndex = (moveNumber - 1) * 2;
		if (!isWhiteActive) {
			moveIndex += 1;
		}

		this.boardStateService.loadFromMoves(this.moves.slice(0, moveIndex + 1));

		this.isInPast();
	}

	private isValidMove(moveNumber: number, isWhiteActive: boolean): boolean {
		if (moveNumber <= 0) {
			return moveNumber == 0 && !isWhiteActive;
		}
		if (moveNumber == Math.ceil(this.moves.length / 2)) {
			return !isWhiteActive ? this.moves.length % 2 == 0 : true;
		}
		return moveNumber < Math.ceil(this.moves.length / 2);
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
