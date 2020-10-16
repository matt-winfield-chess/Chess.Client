import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ChallengerColor } from 'src/app/enums/challenger-color.enum';
import { ChallengesService } from 'src/app/services/http/challenges/challenges.service';

@Component({
	selector: 'app-send-challenge-modal',
	templateUrl: './send-challenge-modal.component.html',
	styleUrls: ['./send-challenge-modal.component.scss']
})
export class SendChallengeModalComponent {

	@Output() public onClose: EventEmitter<void> = new EventEmitter();
	public username: string;
	public challengerColor: ChallengerColor = ChallengerColor.Random;

	constructor(@Inject(ChallengesService) private challengesService: ChallengesService,
		@Inject(ToastrService) private toastr: ToastrService) { }

	public async sendChallenge(): Promise<void> {
		let result = await this.challengesService.sendChallenge(this.username, parseInt(this.challengerColor.toString()));

		if (result?.isSuccess) {
			this.toastr.success('Challenge sent successfully');
		} else {
			if (result?.errors) {
				this.toastr.error(result.errors.join(', '), 'Unable to send challenge');
			} else {
				this.toastr.error('Unable to send challenge');
			}
		}
	}

	public close(): void {
		this.username = null;
		this.onClose.emit();
	}
}
