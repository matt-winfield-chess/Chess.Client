import { Component, Inject, ViewChild } from '@angular/core';
import { GameResult } from 'src/app/classes/game-result';
import { Game } from 'src/app/classes/models/game';
import { Move } from 'src/app/classes/move';
import { BoardComponent } from 'src/app/components/gameplay/board/board.component';
import { PieceType } from 'src/app/enums/piece-type.enum';
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
	public showPromotionPanel: boolean = false;
	public gameResult: GameResult;
	public game: Game<Move> = new Game();
	public isBoardDisabled: boolean = false;

	@ViewChild('board') private board: BoardComponent;
	private activePromotionMove: Move;

	constructor(private boardStateService: BoardStateService) {
		this.boardStateService.setPlayerColor(null);
		this.boardStateService.subscribeToGameEnd((gameResult: GameResult) => this.onGameEnd(gameResult));
		this.boardStateService.subscribeToPlayerMoves((move: Move) => this.onMove(move));

		this.game.moves = [];
		this.game.active = true;
		this.game.fen = this.boardStateService.getBoardState().getFen();
	}

	public isWhiteActiveColor(): boolean {
		return this.boardStateService.getBoardState().activeColor == PlayerColor.White;
	}

	public onCloseGameOverModal(): void {
		this.shouldShowGameOverModal = false;
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

	private onGameEnd(gameResult: GameResult): void {
		this.isGameOver = true;
		this.shouldShowGameOverModal = true;
		this.gameResult = gameResult;
	}

	private onMove(move: Move): void {
		this.game.moves.push(move);
	}
}
