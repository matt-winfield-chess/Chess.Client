import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from '../config/config.service';
import { LoginStateService } from '../login-state.service';
import { SignalRMethod } from './signal-r-method';
import { SignalRService } from './signal-r.service';

@Injectable({
	providedIn: 'root'
})
export class GameHubSignalRService extends SignalRService {
	constructor(configService: ConfigService, spinner: NgxSpinnerService, loginStateService: LoginStateService) {
		super(configService, spinner, 'GAME_HUB', loginStateService);
	}

	public async joinGame(gameId: string): Promise<void> {
		await this.sendWhenConnected(SignalRMethod.JoinGame, gameId);
	}

	public async leaveGame(gameId: string): Promise<void> {
		await this.sendWhenConnected(SignalRMethod.LeaveGame, gameId);
	}

	public async sendMove(move: string, gameId: string): Promise<void> {
		await this.sendWhenConnected(SignalRMethod.Move, move, gameId);
	}
}
