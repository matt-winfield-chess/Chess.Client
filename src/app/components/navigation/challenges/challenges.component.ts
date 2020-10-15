import { Component, Inject } from '@angular/core';
import { ChallengeHubSignalRService } from '../../../services/signal-r/challenge-hub-signal-r.service';
import { Challenge } from '../../../classes/models/challenge';
import { SignalRMethod } from 'src/app/services/signal-r/signal-r-method';

@Component({
	selector: 'app-challenges',
	templateUrl: './challenges.component.html',
	styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent {

	constructor(@Inject(ChallengeHubSignalRService) private challengeHubService: ChallengeHubSignalRService) {
		this.challengeHubService.onMethod(SignalRMethod.NewChallenge, (challenge) => this.onChallengeRecieved(challenge));
	}

	private onChallengeRecieved(challenge: Challenge) {
		console.log(challenge);
	}
}
