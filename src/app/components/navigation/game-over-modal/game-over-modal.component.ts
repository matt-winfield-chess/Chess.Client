import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameResult } from 'src/app/classes/game-result';
import { PlayerColor } from 'src/app/enums/player-color.enum';

@Component({
	selector: 'app-game-over-modal',
	templateUrl: './game-over-modal.component.html',
	styleUrls: ['./game-over-modal.component.scss']
})
export class GameOverModalComponent {
	@Input() public gameResult: GameResult;
	@Output() public onClose: EventEmitter<void> = new EventEmitter<void>();

	public close(): void {
		this.onClose.emit();
	}

	public getGameOverText(): string {
		if (!this.gameResult) {
			return null;
		}

		if (this.gameResult.winnerColor === null) {
			return `Draw by ${this.gameResult.termination}`;
		} else {
			return `${PlayerColor[this.gameResult.winnerColor]} wins by ${this.gameResult.termination}`;
		}
	}
}
