import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BoardSettings } from 'src/app/classes/board-settings';
import { Game } from 'src/app/classes/models/game';
import { Move } from 'src/app/classes/move';
import { BoardType } from 'src/app/enums/board-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';
import { GamesService } from 'src/app/services/http/games/games.service';
import { LoginStateService } from 'src/app/services/login-state.service';
import { GameHubSignalRService } from 'src/app/services/signal-r/game-hub-signal-r.service';
import { SignalRMethod } from 'src/app/services/signal-r/signal-r-method';
import { GameResult } from 'src/app/classes/game-result';

@Component({
	selector: 'app-game-page',
	templateUrl: './game-page.component.html',
	styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {

	public boardSettings: BoardSettings = new BoardSettings({
		type: BoardType.Game
	});

	public isGameOver: boolean = false;
	public shouldShowGameOverModal: boolean = false;
	public gameResult: GameResult;
	public gameId: string;

	constructor(@Inject(GamesService) private gamesService: GamesService,
		@Inject(GameHubSignalRService) private gameHubSignalRService: GameHubSignalRService,
		@Inject(LoginStateService) private loginStateService: LoginStateService,
		@Inject(CoordinateNotationParserService) private coordinateNotationParserService: CoordinateNotationParserService,
		@Inject(BoardStateService) private boardStateService: BoardStateService,
		@Inject(ActivatedRoute) private route: ActivatedRoute,
		@Inject(NgxSpinnerService) private spinner: NgxSpinnerService,
		@Inject(ToastrService) private toastr: ToastrService) {

		this.gameHubSignalRService.onMethod(SignalRMethod.MovePlayed, (move: string) => this.onOpponentMove(move));
		this.gameHubSignalRService.onMethod(SignalRMethod.IllegalMove, (fen: string) => this.onIllegalMove(fen));
		this.gameHubSignalRService.onMethod(SignalRMethod.Checkmate, (gameResult: GameResult) => this.onGameOver(gameResult));
		this.gameHubSignalRService.onMethod(SignalRMethod.Stalemate, (gameResult: GameResult) => this.onGameOver(gameResult));
		this.gameHubSignalRService.onMethod(SignalRMethod.Resignation, (gameResult: GameResult) => this.onGameOver(gameResult));
		this.boardStateService.subscribeToGameEnd((gameResult: GameResult) => this.onGameEnd(gameResult));
	}

	public ngOnInit(): void {
		this.route.params.subscribe(async params => {
			this.gameId = params['id'];

			this.spinner.show();
			let gameResponse = await this.gamesService.getGame(this.gameId);
			this.spinner.hide();

			if (gameResponse.isSuccess) {
				await this.gameHubSignalRService.joinGame(this.gameId);

				this.boardSettings.game = gameResponse.data;
				this.boardSettings.playerColor = this.getPlayerColorFromGame(gameResponse.data);
				this.boardStateService.loadFromFen(this.boardSettings.game.fen);
			} else if (gameResponse?.errors) {
				this.toastr.error(gameResponse.errors.join(', '), 'Unable to load game');
			} else {
				this.toastr.error('Unable to load game');
			}
		});
	}

	public async onPlayerPieceMoved(move: Move): Promise<void> {
		let moveString: string = this.coordinateNotationParserService.convertMoveToNotation(move);

		this.gameHubSignalRService.sendMove(moveString, this.gameId);
		let didMoveSendSuccessfully = await this.gameHubSignalRService.waitForResponseWithRetry(SignalRMethod.MoveReceived, () => {
			this.toastr.warning('move failed to send, trying again...');
			this.gameHubSignalRService.sendMove(moveString, this.gameId);
		});

		if (!didMoveSendSuccessfully) {
			this.toastr.error('Unable to send move!');
		}
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

	private onOpponentMove(moveString: string): void {
		let move = this.coordinateNotationParserService.toMove(moveString);

		this.boardStateService.applyOnlineOpponentMove(move.oldX, move.oldY, move.newX, move.newY);
	}

	private onIllegalMove(fen: string): void {
		this.boardStateService.loadFromFen(fen);
	}

	private onGameOver(gameResult: GameResult): void {
		this.isGameOver = true;
		this.shouldShowGameOverModal = true;
		this.gameResult = gameResult;
	}

	private getPlayerColorFromGame(game: Game): PlayerColor {
		let playerId = this.loginStateService.getUserId();

		return game.whitePlayer.id == playerId ? PlayerColor.White : PlayerColor.Black;
	}
}
