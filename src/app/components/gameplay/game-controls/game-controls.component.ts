import { Component, Input, OnInit } from '@angular/core';
import { GamesService } from 'src/app/services/http/games/games.service';

@Component({
	selector: 'app-game-controls',
	templateUrl: './game-controls.component.html',
	styleUrls: ['./game-controls.component.scss']
})
export class GameControlsComponent {

	@Input() gameId: string;

	constructor(private gamesService: GamesService) { }

	public resign(): void {
		this.gamesService.resign(this.gameId);
	}
}
