import { Component, Inject, OnInit } from '@angular/core';
import { ChallengeHubSignalRService } from '../../../services/signal-r/challenge-hub-signal-r.service';
import { Challenge } from '../../../classes/models/challenge';
import { SignalRMethod } from 'src/app/services/signal-r/signal-r-method';
import { ChallengerColor } from 'src/app/enums/challenger-color.enum';
import { ChallengesService } from 'src/app/services/http/challenges/challenges.service'
import { LoginStateService } from 'src/app/services/login-state.service';

@Component({
	selector: 'app-challenges',
	templateUrl: './challenges.component.html',
	styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent implements OnInit {

	public activeChallenges: Challenge[] = [];

	constructor(@Inject(ChallengeHubSignalRService) private challengeHubService: ChallengeHubSignalRService,
		@Inject(ChallengesService) private challengeService: ChallengesService,
		@Inject(LoginStateService) private loginStateService: LoginStateService) {
		this.challengeHubService.onMethod(SignalRMethod.NewChallenge, (challenge) => this.onChallengeRecieved(challenge));
		this.loginStateService.subscribeToLogIn(() => this.onLogIn());
		this.loginStateService.subscribeToLogOut(() => this.onLogOut());
	}

	public async ngOnInit(): Promise<void> {
		this.syncChallenges();
	}

	public accept(challenge: Challenge): void {

	}

	public async decline(challenge: Challenge): Promise<void> {
		await this.challengeService.deleteChallenge(challenge.challenger.id, challenge.recipient.id);

		let challengeIndex = this.activeChallenges.findIndex(c =>
			c.challenger.id == challenge.challenger.id
			&& c.recipient.id == challenge.recipient.id);

		this.activeChallenges.splice(challengeIndex, 1);
	}

	private onLogIn(): void {
		this.syncChallenges();
		this.challengeHubService.reconnect();
	}

	private onLogOut(): void {
		this.activeChallenges = [];
	}

	private async syncChallenges(): Promise<void> {
		if (this.loginStateService.isLoggedIn()) {
			let challengesResponse = await this.challengeService.getChallenges();
			if (challengesResponse?.isSuccess) {
				this.activeChallenges = challengesResponse.data;
			}
		}
	}

	private onChallengeRecieved(challenge: Challenge) {
		this.activeChallenges.push(challenge);
	}
}
