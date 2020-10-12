import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent implements AfterViewInit {
	@ViewChild('board') private board: ElementRef<HTMLElement>;

	public ngAfterViewInit(): void {
		this.updateBoardDimensions();
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
}
