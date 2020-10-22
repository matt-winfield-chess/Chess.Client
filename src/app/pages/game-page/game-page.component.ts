import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BoardSettings } from 'src/app/classes/board-settings';
import { Game } from 'src/app/classes/models/game';
import { BoardType } from 'src/app/enums/board-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { GamesService } from 'src/app/services/http/games/games.service';
import { LoginStateService } from 'src/app/services/login-state.service';

@Component({
	selector: 'app-game-page',
	templateUrl: './game-page.component.html',
	styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

	public boardSettings: BoardSettings = new BoardSettings({
		type: BoardType.Game
	});
	private gameId: string;

	constructor(@Inject(GamesService) private gamesService: GamesService,
		@Inject(LoginStateService) private loginStateService: LoginStateService,
		@Inject(ActivatedRoute) private route: ActivatedRoute,
		@Inject(NgxSpinnerService) private spinner: NgxSpinnerService,
		@Inject(ToastrService) private toastr: ToastrService) { }

	public ngOnInit(): void {
		this.route.params.subscribe(async params => {
			this.gameId = params['id'];

			this.spinner.show();
			let gameResponse = await this.gamesService.getGame(this.gameId);
			this.spinner.hide();

			if (gameResponse.isSuccess) {
				this.boardSettings.game = gameResponse.data;
				this.boardSettings.playerColor = this.getPlayerColorFromGame(gameResponse.data);
			} else if (gameResponse?.errors) {
				this.toastr.error(gameResponse.errors.join(', '), 'Unable to load game');
			} else {
				this.toastr.error('Unable to load game');
			}
		});
	}

	private getPlayerColorFromGame(game: Game): PlayerColor {
		let playerId = this.loginStateService.getUserId();

		return game.whitePlayer.id == playerId ? PlayerColor.White : PlayerColor.Black;
	}

}
