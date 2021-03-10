import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Game } from 'src/app/classes/models/game';
import { Move } from 'src/app/classes/move';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { GamesService } from 'src/app/services/http/games/games.service';

@Component({
	selector: 'app-game-controls',
	templateUrl: './game-controls.component.html',
	styleUrls: ['./game-controls.component.scss']
})
export class GameControlsComponent {

	@Input() public game: Game<Move>;
	@Input() public playerColor: PlayerColor;

	constructor(private gamesService: GamesService) { }

	public resign(): void {
		this.gamesService.resign(this.game.id);
	}

	public offerDraw(): void {
		this.gamesService.offerDraw(this.game.id);
	}
}
