import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChallengerColor } from 'src/app/enums/challenger-color.enum';
import { ChallengesService } from 'src/app/services/http/challenges/challenges.service';
import { BaseComponent } from '../../base-component';

@Component({
	selector: 'app-send-challenge-modal',
	templateUrl: './send-challenge-modal.component.html',
	styleUrls: ['./send-challenge-modal.component.scss']
})
export class SendChallengeModalComponent extends BaseComponent {

	@Output() public onClose: EventEmitter<void> = new EventEmitter();
	public username: string;
	public challengerColor: ChallengerColor = ChallengerColor.Random;

	constructor(protected toastr: ToastrService, private challengesService: ChallengesService) {
		super(toastr);
	}

	public async sendChallenge(): Promise<void> {
		await this.requestWithToastr(() => this.challengesService.sendChallenge(this.username, parseInt(this.challengerColor.toString())),
			'Unable to send challenge',
			'Challenge sent successfully');
	}

	public close(): void {
		this.username = null;
		this.onClose.emit();
	}
}
