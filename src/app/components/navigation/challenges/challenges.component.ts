import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ChallengeHubSignalRService } from '../../../services/signal-r/challenge-hub-signal-r.service';
import { Challenge } from '../../../classes/models/challenge';
import { SignalRMethod } from 'src/app/services/signal-r/signal-r-method';
import { ChallengesService } from 'src/app/services/http/challenges/challenges.service';
import { LoginStateService } from 'src/app/services/login-state.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Game } from 'src/app/classes/models/game';
import { NavbarButtonComponent } from '../navbar-button/navbar-button.component';

@Component({
	selector: 'app-challenges',
	templateUrl: './challenges.component.html',
	styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent implements OnInit {

	@ViewChild('challengesNavbarButton') challengesNavbarButton: NavbarButtonComponent;

	public activeChallenges: Challenge[] = [];
	public displayChallenges: boolean = false;

	constructor(@Inject(ChallengeHubSignalRService) private challengeHubService: ChallengeHubSignalRService,
		@Inject(ChallengesService) private challengeService: ChallengesService,
		@Inject(LoginStateService) private loginStateService: LoginStateService,
		@Inject(ToastrService) private toastr: ToastrService,
		@Inject(Router) private router: Router) {
		this.challengeHubService.onMethod(SignalRMethod.NewChallenge, (challenge) => this.onChallengeRecieved(challenge));
		this.challengeHubService.onMethod(SignalRMethod.ChallengeAccepted, (game) => this.onChallengeAccepted(game));
		this.loginStateService.subscribeToLogIn(() => this.onLogIn());
		this.loginStateService.subscribeToLogOut(() => this.onLogOut());
	}

	public async ngOnInit(): Promise<void> {
		this.syncChallenges();
	}

	public async accept(challenge: Challenge): Promise<void> {
		let result = await this.challengeService.acceptChallenge(challenge);

		if (result?.isSuccess) {
			let game = result.data;
			this.router.navigate(['/game', game.id]);
			this.syncChallenges();
		} else {
			if (result?.errors) {
				this.toastr.error(result.errors.join(', '), 'Failed to accept challenge');
			} else {
				this.toastr.error('Failed to accept challenge');
			}
		}
	}

	public async decline(challenge: Challenge): Promise<void> {
		await this.challengeService.deleteChallenge(challenge.challenger.id, challenge.recipient.id);

		let challengeIndex = this.activeChallenges.findIndex(c =>
			c.challenger.id == challenge.challenger.id
			&& c.recipient.id == challenge.recipient.id);

		this.activeChallenges.splice(challengeIndex, 1);
		this.updateBadge();
	}

	public toggleChallengesVisibility(): void {
		this.displayChallenges = this.displayChallenges ? false : true;
		this.challengesNavbarButton.setActive(this.displayChallenges);
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
		this.updateBadge();
	}

	private onChallengeRecieved(challenge: Challenge): void {
		this.activeChallenges.push(challenge);
		this.updateBadge();
	}

	private onChallengeAccepted(game: Game): void {
		console.log(game);
		this.router.navigate(['/game', game.id]);
	}

	private updateBadge(): void {
		if (this.activeChallenges.length > 0) {
			this.challengesNavbarButton.setBadgeText(this.activeChallenges.length.toString());
			this.challengesNavbarButton.setBadgeVisible(true);
		} else {
			this.challengesNavbarButton.setBadgeVisible(false);
		}
	}
}
