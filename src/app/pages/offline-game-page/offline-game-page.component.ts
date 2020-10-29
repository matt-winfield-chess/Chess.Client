import { Component, Inject } from '@angular/core';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';

@Component({
	selector: 'app-offline-game-page',
	templateUrl: './offline-game-page.component.html',
	styleUrls: ['./offline-game-page.component.scss']
})
export class OfflineGamePageComponent {

	constructor(@Inject(BoardStateService) private boardStateService: BoardStateService) { }

	public isWhiteActiveColor(): boolean {
		return this.boardStateService.getBoardState().activeColor == PlayerColor.White;
	}
}
