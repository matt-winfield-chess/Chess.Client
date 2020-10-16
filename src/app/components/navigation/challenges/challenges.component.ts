import { Component, Inject } from '@angular/core';
import { ChallengeHubSignalRService } from '../../../services/signal-r/challenge-hub-signal-r.service';
import { Challenge } from '../../../classes/models/challenge';
import { SignalRMethod } from 'src/app/services/signal-r/signal-r-method';
import { ChallengerColor } from 'src/app/enums/challenger-color.enum';

@Component({
	selector: 'app-challenges',
	templateUrl: './challenges.component.html',
	styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent {

	public activeChallenges: Challenge[] = [
		// {
		// 	challenger: { id: 1, username: 'username1' },
		// 	recipient: { id: 2, username: 'username2' },
		// 	challengerColor: ChallengerColor.Random
		// },
		// {
		// 	challenger: { id: 1, username: 'username1' },
		// 	recipient: { id: 2, username: 'username3' },
		// 	challengerColor: ChallengerColor.Random
		// }
	];

	constructor(@Inject(ChallengeHubSignalRService) private challengeHubService: ChallengeHubSignalRService) {
		this.challengeHubService.onMethod(SignalRMethod.NewChallenge, (challenge) => this.onChallengeRecieved(challenge));
	}

	private onChallengeRecieved(challenge: Challenge) {
		this.activeChallenges.push(challenge);
	}
}
