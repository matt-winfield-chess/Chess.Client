import { Component, Inject } from '@angular/core';
import { GameResult } from 'src/app/classes/game-result';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';

@Component({
	selector: 'app-offline-game-page',
	templateUrl: './offline-game-page.component.html',
	styleUrls: ['./offline-game-page.component.scss']
})
export class OfflineGamePageComponent {

	public isGameOver: boolean = false;
	public shouldShowGameOverModal: boolean = false;
	public gameResult: GameResult;

	constructor(private boardStateService: BoardStateService) {
		this.boardStateService.setPlayerColor(null);
		this.boardStateService.subscribeToGameEnd((gameResult: GameResult) => this.onGameEnd(gameResult));
	}

	public isWhiteActiveColor(): boolean {
		return this.boardStateService.getBoardState().activeColor == PlayerColor.White;
	}

	public onCloseGameOverModal(): void {
		this.shouldShowGameOverModal = false;
	}

	private onGameEnd(gameResult: GameResult): void {
		this.isGameOver = true;
		this.shouldShowGameOverModal = true;
		this.gameResult = gameResult;
	}
}
