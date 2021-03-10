import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BoardSettings } from 'src/app/classes/board-settings';
import { GameResult } from 'src/app/classes/game-result';
import { Move } from 'src/app/classes/move';
import { BoardComponent } from 'src/app/components/gameplay/board/board.component';
import { MoveHistoryComponent } from 'src/app/components/navigation/move-history/move-history.component';
import { BoardType } from 'src/app/enums/board-type.enum';
import { PieceType } from 'src/app/enums/piece-type.enum';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';
import { StockfishService } from 'src/app/services/engines/stockfish.service';

@Component({
	selector: 'app-computer-game-page',
	templateUrl: './computer-game-page.component.html',
	styleUrls: ['./computer-game-page.component.scss']
})
export class ComputerGamePageComponent implements OnDestroy {

	@ViewChild('board') board: BoardComponent;

	public isGameOver: boolean = false;
	public shouldShowGameOverModal: boolean = false;
	public showPromotionPanel: boolean = false;
	public gameResult: GameResult;
	public boardSettings: BoardSettings = new BoardSettings({
		type: BoardType.Game,
		playerColor: PlayerColor.White
	});
	public gameMoves: Move[] = [];
	public isBoardDisabled: boolean = false;

	private displayedDifficulty: number = 10;
	private activePromotionMove: Move;

	private subscriptions: Subscription[] = [];

	constructor(private stockfishService: StockfishService, private boardStateService: BoardStateService,
		private coordinateNotationParser: CoordinateNotationParserService, private router: Router) {
		this.boardStateService.setPlayerColor(null);
		let playerMovesSubscription = this.boardStateService.subscribeToPlayerMoves(move => this.onPlayerMove(move));
		let nonPlayerMovesSubscription = this.boardStateService.subscribeToNonPlayerMoves(move => this.onOpponentMove(move));
		this.boardStateService.subscribeToGameEnd((gameResult: GameResult) => this.onGameEnd(gameResult));
		this.stockfishService.start();
		this.displayedDifficulty = this.stockfishService.getDifficulty();

		let routerSubscription = this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.stockfishService.stop();
			}
		});

		this.subscriptions.push(playerMovesSubscription, nonPlayerMovesSubscription, routerSubscription);
	}

	ngOnDestroy(): void {
		for (let subscription of this.subscriptions) {
			subscription.unsubscribe();
		}
	}

	public isWhiteActiveColor(): boolean {
		return this.boardStateService.getBoardState().activeColor == PlayerColor.White;
	}

	public onCloseGameOverModal(): void {
		this.shouldShowGameOverModal = false;
	}

	public getEngineState(): string {
		return this.stockfishService.getState();
	}

	public setDifficulty(difficulty: number): void {
		this.stockfishService.setDifficulty(difficulty);
	}

	public getDisplayedDifficulty(): number {
		return this.displayedDifficulty;
	}

	public setDisplayedDifficulty(difficulty: number): void {
		this.displayedDifficulty = difficulty;
	}

	public async switchSides(): Promise<void> {
		this.board.hideLegalMoves();

		this.boardSettings.playerColor = this.boardSettings.playerColor == PlayerColor.White
			? PlayerColor.Black
			: PlayerColor.White;

		this.boardStateService.setPlayerColor(this.boardSettings.playerColor);
		this.board.flipBoard = this.boardSettings.playerColor == PlayerColor.Black;

		if (this.boardStateService.getBoardState().activeColor != this.boardSettings.playerColor) {
			await this.makeEngineMove();
		}
	}

	public startPromotionPrompt(move: Move): void {
		this.activePromotionMove = move;
		this.showPromotionPanel = true;
	}

	public onPromotionSelected(pieceType: PieceType): void {
		this.activePromotionMove.promotion = pieceType;
		this.board.completePromotion(this.activePromotionMove);
		this.activePromotionMove = null;
		this.showPromotionPanel = false;
	}

	public onMoveIntoPast(isInPast: boolean): void {
		this.isBoardDisabled = isInPast;
	}

	private onOpponentMove(move: Move): void {
		this.gameMoves.push(move);
	}

	private async onPlayerMove(move: Move): Promise<void> {
		this.gameMoves.push(move);

		await this.makeEngineMove();
	}

	private async makeEngineMove(): Promise<void> {
		var bestMoveString = await this.stockfishService.calculateMove(this.gameMoves);
		var bestMove = this.coordinateNotationParser.toMove(bestMoveString);

		this.boardStateService.applyNonPlayerMove(bestMove);
	}

	private onGameEnd(gameResult: GameResult): void {
		this.isGameOver = true;
		this.shouldShowGameOverModal = true;
		this.gameResult = gameResult;
	}
}
