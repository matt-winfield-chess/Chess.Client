import { Component } from '@angular/core';
import { GameResult } from 'src/app/classes/game-result';
import { Move } from 'src/app/classes/move';
import { PlayerColor } from 'src/app/enums/player-color.enum';
import { BoardStateService } from 'src/app/services/board-state.service';
import { CoordinateNotationParserService } from 'src/app/services/coordinate-notation-parser.service';
import { StockfishService } from 'src/app/services/engines/stockfish.service';

@Component({
	selector: 'app-computer-game-page',
	templateUrl: './computer-game-page.component.html',
	styleUrls: ['./computer-game-page.component.scss']
})
export class ComputerGamePageComponent {

	public isGameOver: boolean = false;
	public shouldShowGameOverModal: boolean = false;
	public gameResult: GameResult;
	private gameMoves: Move[] = [];

	constructor(private stockfishService: StockfishService, private boardStateService: BoardStateService,
		private coordinateNotationParser: CoordinateNotationParserService) {
		this.boardStateService.setPlayerColor(null);
		this.boardStateService.subscribeToPlayerMoves(move => this.onPlayerMove(move));
		this.boardStateService.subscribeToNonPlayerMoves(move => this.onOpponentMove(move));
		this.boardStateService.subscribeToGameEnd((gameResult: GameResult) => this.onGameEnd(gameResult));
		this.stockfishService.start();
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

	public getDifficulty(): number {
		return this.stockfishService.getDifficulty();
	}

	private onOpponentMove(move: Move): void {
		this.gameMoves.push(move);
	}

	private async onPlayerMove(move: Move): Promise<void> {
		this.gameMoves.push(move);

		var bestMoveString = await this.stockfishService.calculateMove(this.gameMoves);
		var bestMove = this.coordinateNotationParser.toMove(bestMoveString);

		this.boardStateService.applyNonPlayerMove(bestMove.oldX, bestMove.oldY, bestMove.newX, bestMove.newY);
	}

	private onGameEnd(gameResult: GameResult): void {
		this.isGameOver = true;
		this.shouldShowGameOverModal = true;
		this.gameResult = gameResult;
	}
}
