import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Game } from 'src/app/classes/models/game';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { GamesService } from 'src/app/services/http/games/games.service';
import { GameHubSignalRService } from 'src/app/services/signal-r/game-hub-signal-r.service';
import { SignalRMethod } from 'src/app/services/signal-r/signal-r-method';

@Component({
	selector: 'app-draw-offer-status',
	templateUrl: './draw-offer-status.component.html',
	styleUrls: ['./draw-offer-status.component.scss']
})
export class DrawOfferStatusComponent implements OnInit, OnChanges {

	@Input() public game: Game;
	@Input() public playerColor: PlayerColor;

	public showDrawOffer: boolean = false;
	public showDrawOfferButtons: boolean = true;
	public drawOfferColor: string;

	constructor(gameHubSignalRService: GameHubSignalRService, private gamesService: GamesService) {
		gameHubSignalRService.onMethod(SignalRMethod.DrawOffer, (color: string) => this.onDrawOffer(color));
		gameHubSignalRService.onMethod(SignalRMethod.DrawOfferDeclined, () => this.onDrawOfferDeclined());
	}

	public ngOnInit(): void {
		if (this.game.drawOffer) {
			this.onDrawOffer(this.game.drawOffer);
		}
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.game && changes.game.currentValue) {
			if (this.game.drawOffer) {
				this.onDrawOffer(this.game.drawOffer);
			}
		}
	}

	public acceptDraw(): void {
		this.gamesService.acceptDraw(this.game.id);
	}

	public declineDraw(): void {
		this.gamesService.declineDraw(this.game.id);
	}

	private onDrawOffer(color: string): void {
		this.showDrawOffer = true;

		this.showDrawOfferButtons = this.playerColor == PlayerColor.White
			? color == "black"
			: color == "white";

		this.drawOfferColor = color;
	}

	private onDrawOfferDeclined(): void {
		this.showDrawOffer = false;
	}
}
