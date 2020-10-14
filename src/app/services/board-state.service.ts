import { Injectable } from '@angular/core';
import { BoardState } from '../classes/board-state';

@Injectable({
	providedIn: 'root'
})
export class BoardStateService {

	public boardState: BoardState;

	public notifyMove(oldX: number, oldY: number, newX: number, newY: number): void {
		var piece = this.boardState.pieces.find(p => p.x == oldX && p.y == oldY);

		if (piece) {
			piece.x = newX;
			piece.y = newY;
		}
	}
}
